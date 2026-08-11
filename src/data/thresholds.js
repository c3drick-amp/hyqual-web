// PLACEHOLDER threshold ranges — replace with real DAO 2016-08 values once finalized.
// Each parameter has a "normal" range. Outside that but within "moderate" = orange.
// Beyond "moderate" = critical (red).

export const THRESHOLDS = {
  temp: { normalMin: 26, normalMax: 32, moderateMin: 24, moderateMax: 34 },
  ph: { normalMin: 7.5, normalMax: 8.5, moderateMin: 7.0, moderateMax: 9.0 },
  do: { normalMin: 5, normalMax: Infinity, moderateMin: 3, moderateMax: Infinity },
  sal: { normalMin: 10, normalMax: 25, moderateMin: 5, moderateMax: 30 },
};

// Returns "normal" | "moderate" | "critical" for a single reading
export function getParamStatus(param, value) {
  const t = THRESHOLDS[param];
  if (!t) return "normal";

  if (value >= t.normalMin && value <= t.normalMax) return "normal";
  if (value >= t.moderateMin && value <= t.moderateMax) return "moderate";
  return "critical";
}

// Combines all 4 readings into one overall status (worst one wins)
export function getOverallStatus(readings) {
  const severity = { normal: 0, moderate: 1, critical: 2 };
  let worst = "normal";

  for (const param of ["temp", "ph", "do", "sal"]) {
    const status = getParamStatus(param, readings[param]);
    if (severity[status] > severity[worst]) worst = status;
  }

  return worst;
}