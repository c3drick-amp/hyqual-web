import { farms } from "./farmsData";
import { getParamStatus } from "./thresholds";
import { readingsPool, offlineEvents } from "./readingsPool";

// Report "definitions" — just which date range + label each summary report covers.
// This is the ONLY part that's still hand-set; everything else below is computed
// live from readingsPool, the same way it would be computed from a real Firestore
// query once that's connected.
const REPORT_DEFINITIONS = {
  1: {
    title: "Weekly Summary Report",
    dateRangeLabel: "June 8 - 14, 2026",
    start: "2026-06-08",
    end: "2026-06-14",
    generatedDate: "June 14, 2026",
    reportId: "HQ-2026-0614A",
  },
  2: {
    title: "Weekly Summary Report",
    dateRangeLabel: "June 4 - 10, 2026",
    start: "2026-06-04",
    end: "2026-06-10",
    generatedDate: "June 10, 2026",
    reportId: "HQ-2026-0610A",
  },
  3: {
    title: "Daily Summary Report",
    dateRangeLabel: "June 1, 2026",
    start: "2026-06-01",
    end: "2026-06-01",
    generatedDate: "June 01, 2026",
    reportId: "HQ-2026-0601D",
  },
  4: {
    title: "Daily Summary Report",
    dateRangeLabel: "May 28, 2026",
    start: "2026-05-28",
    end: "2026-05-28",
    generatedDate: "May 28, 2026",
    reportId: "HQ-2026-0528D",
  },
};

const paramMeta = {
  temperature: { label: "Water Temperature", unit: "°C", key: "temperature", thresholdKey: "temp" },
  phLevel: { label: "pH Level", unit: "", key: "phLevel", thresholdKey: "ph" },
  dissolvedOxygen: { label: "Dissolved Oxygen (DO)", unit: "mg/L", key: "dissolvedOxygen", thresholdKey: "do" },
  salinity: { label: "Salinity", unit: "ppt", key: "salinity", thresholdKey: "sal" },
};

function inRange(recordedAt, start, end) {
  const day = recordedAt.slice(0, 10); // "YYYY-MM-DD"
  return day >= start && day <= end;
}

function average(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function formatValue(value, unit) {
  return unit ? `${value.toFixed(2)} ${unit}` : value.toFixed(2);
}

// Filters the readings pool the same way a Firestore query would:
// WHERE farmId == X AND pondId == Y AND recordedAt BETWEEN start AND end
function getReadingsFor(farmId, pondId, start, end) {
  return readingsPool.filter(
    (r) => r.farmId === farmId && r.pondId === pondId && inRange(r.recordedAt, start, end)
  );
}

function getOfflineIncidentsFor(farmId, pondId, start, end) {
  return offlineEvents
    .filter((e) => e.farmId === farmId && e.pondId === pondId && e.date >= start && e.date <= end)
    .map((e) => ({
      timestamp: `${e.date} (device offline)`,
      parameter: "—",
      value: "No data",
      description: "Device offline for the day — no monitoring data recorded",
    }));
}

function buildPondReport(farmId, pond, start, end) {
  const rows = getReadingsFor(farmId, pond.id, start, end);

  const parameters = Object.values(paramMeta).map((meta) => {
    if (rows.length === 0) {
      return { parameter: meta.label, weeklyAvg: "—", min: "—", max: "—", status: "offline" };
    }
    const values = rows.map((r) => r[meta.key]);
    const avg = average(values);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const status = getParamStatus(meta.thresholdKey, avg);

    return {
      parameter: meta.label,
      weeklyAvg: formatValue(avg, meta.unit),
      min: formatValue(min, meta.unit),
      max: formatValue(max, meta.unit),
      status,
    };
  });

  // Any individual reading that came back critical/moderate becomes an incident row —
  // this is derived data, not hand-written, same as real historical logging would produce.
  const readingIncidents = [];
  rows.forEach((r) => {
    Object.values(paramMeta).forEach((meta) => {
      const status = getParamStatus(meta.thresholdKey, r[meta.key]);
      if (status !== "normal") {
        readingIncidents.push({
          timestamp: r.recordedAt.replace("T", " ").replace("Z", ""),
          parameter: meta.label,
          value: formatValue(r[meta.key], meta.unit),
          description: `${meta.label} reading of ${formatValue(r[meta.key], meta.unit)} flagged ${status}.`,
        });
      }
    });
  });

  const offlineIncidents = getOfflineIncidentsFor(farmId, pond.id, start, end);
  const incidents = [...offlineIncidents, ...readingIncidents];

  return { pondName: pond.name, parameters, incidents };
}

// This is the function the UI actually calls. Today it reads from readingsPool
// (a local array). Once Firebase is connected, only the INSIDE of this function
// changes to a real Firestore query + aggregation — ReportPreview.jsx and
// ReportsAnalytics.jsx never need to change, since they only ever call this.
export function getReportData(reportId) {
  const def = REPORT_DEFINITIONS[reportId];
  if (!def) return null;

  const farmReports = farms.map((farm) => {
    const ponds = farm.ponds.map((pond) => buildPondReport(farm.id, pond, def.start, def.end));

    // Overall farm status = worst status among all its ponds' parameters
    // (same "worst wins" logic used everywhere else in the app, e.g. thresholds.js).
    const allStatuses = ponds.flatMap((p) => p.parameters.map((param) => param.status));
    const severity = { normal: 0, moderate: 1, critical: 2, offline: 1 };
    const overallStatus = allStatuses.reduce(
      (worst, s) => (severity[s] > severity[worst] ? s : worst),
      "normal"
    );

    return {
      farmName: farm.name,
      owner: farm.owner,
      location: farm.location,
      overallStatus,
      ponds,
    };
  });

  const summary = {
    farmsInReport: farmReports.length,
    normalOverall: farmReports.filter((f) => f.overallStatus === "normal").length,
    moderateOverall: farmReports.filter((f) => f.overallStatus === "moderate").length,
    criticalOverall: farmReports.filter((f) => f.overallStatus === "critical").length,
  };

  return {
    title: def.title,
    dateRange: def.dateRangeLabel,
    generatedDate: def.generatedDate,
    preparedFor: "BFAR Oriental Mindoro",
    reportId: def.reportId,
    summary,
    farms: farmReports,
  };
}