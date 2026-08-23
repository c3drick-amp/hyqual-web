import { useState } from "react";
import { Bell, Calendar, FileText, Download, ChevronDown, Eye } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../components/Sidebar";
import DateRangeModal from "../components/DateRangeModal";
import ReportPreview from "../components/ReportPreview";
import { trendData, statusDistribution, summaryReports, availableFormats } from "../data/reportsData";
import "./ReportsAnalytics.css";

const statusFilters = ["All", "Normal", "Critical", "Warning", "Offline"];

const filterKeyMap = { Normal: "normal", Critical: "critical", Warning: "warning", Offline: "offline" };
const chartColors = { normal: "#1f9d6e", critical: "#dc2626", warning: "#f59e0b" };

function ReportsAnalytics() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showDateModal, setShowDateModal] = useState(false);
  const [customRange, setCustomRange] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState(
    Object.fromEntries(summaryReports.map((r) => [r.id, r.defaultFormat]))
  );

  const activeChartKeys =
    activeFilter === "All"
      ? ["normal", "critical", "warning"]
      : activeFilter === "Offline"
      ? []
      : [filterKeyMap[activeFilter]];

  const filteredDistribution =
    activeFilter === "All"
      ? statusDistribution
      : statusDistribution.filter((s) => s.label === activeFilter);

  const handleFormatSelect = (reportId, format) => {
    setSelectedFormats((prev) => ({ ...prev, [reportId]: format }));
    setOpenDropdownId(null);
  };

  const handlePreview = (report) => {
    // Only the "Weekly water quality risk summary" reports have a styled preview for now
    setShowReportPreview(true);
  };

  const handleDownload = (report) => {
    const format = selectedFormats[report.id];
    const mimeTypes = { PDF: "application/pdf", CSV: "text/csv", XLSX: "application/vnd.ms-excel" };

    const content = `HyQual Report\nTitle: ${report.title}\nDate: ${report.date}\nFormat: ${format}\n\n(Placeholder content — replace with real generated report data.)`;
    const blob = new Blob([content], { type: mimeTypes[format] || "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, "_")}.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {showReportPreview ? (
          <ReportPreview onClose={() => setShowReportPreview(false)} />
        ) : (
          <>
            <div className="dashboard-header">
              <div>
                <h1>Reports &amp; Analytics</h1>
              </div>
              <div className="header-actions">
                <button className="icon-btn">
                  <Bell size={18} />
                  <span className="notif-badge">3</span>
                </button>
              </div>
            </div>

            <div className="filter-pills" style={{ marginBottom: 20 }}>
              {statusFilters.map((f) => (
                <button
                  key={f}
                  className={"filter-pill" + (activeFilter === f ? " filter-pill-active" : "")}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="reports-grid">
              {/* TREND CHART */}
              <div className="chart-card">
                <div className="chart-card-header">
                  <div>
                    <h3>Overall Water Quality Risk Trend</h3>
                    <p>Aggregated across all monitored farms</p>
                  </div>
                  <button className="icon-btn" onClick={() => setShowDateModal(true)}>
                    <Calendar size={16} />
                  </button>
                </div>

                {activeChartKeys.length === 0 ? (
                  <p className="chart-empty-note">Offline status has no trend data to display.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      {activeChartKeys.map((key) => (
                        <Area
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={chartColors[key]}
                          fill={chartColors[key]}
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* STATUS DISTRIBUTION */}
              <div className="distribution-card">
                <h3>Farm status distribution</h3>

                {filteredDistribution.map((s) => (
                  <div className="distribution-row" key={s.label}>
                    <div className="distribution-top">
                      <span>{s.label}</span>
                      <span>{s.percent}%</span>
                    </div>
                    <div className="distribution-bar-track">
                      <div
                        className="distribution-bar-fill"
                        style={{ width: `${s.percent}%`, background: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMARY REPORTS */}
            <div className="summary-reports-card">
              <h3>Summary reports</h3>

              {summaryReports.map((report) => (
                <div className="report-item" key={report.id}>
                  <span className="icon-box icon-box-green">
                    <FileText size={18} />
                  </span>

                  <div className="report-info">
                    <p className="report-title">{report.title}</p>
                    <p className="report-meta">{report.date} · {report.size}</p>
                  </div>

                  <div className="report-actions">
                    <button className="row-action-btn" onClick={() => handlePreview(report)}>
                      <Eye size={16} />
                    </button>

                    <div className="format-dropdown-wrapper">
                      <button
                        className="format-dropdown-btn"
                        onClick={() => setOpenDropdownId(openDropdownId === report.id ? null : report.id)}
                      >
                        {selectedFormats[report.id]} <ChevronDown size={14} />
                      </button>

                      {openDropdownId === report.id && (
                        <div className="format-dropdown-menu">
                          {availableFormats.map((fmt) => (
                            <button
                              key={fmt}
                              className="format-dropdown-item"
                              onClick={() => handleFormatSelect(report.id, fmt)}
                            >
                              {fmt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button className="download-btn" onClick={() => handleDownload(report)}>
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {showDateModal && (
        <DateRangeModal
          onClose={() => setShowDateModal(false)}
          onApply={(from, to) => setCustomRange({ from, to })}
        />
      )}
    </div>
  );
}

export default ReportsAnalytics;