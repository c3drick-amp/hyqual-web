import { useState } from "react";
import { Bell, Calendar, FileText, Download, ChevronDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../components/Sidebar";
import DateRangeModal from "../components/DateRangeModal";
import { trendData, statusDistribution, summaryReports, availableFormats } from "../data/reportsData";
import "./ReportsAnalytics.css";

const statusFilters = ["All", "Normal", "Critical", "Warning", "Offline"];

function ReportsAnalytics() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showDateModal, setShowDateModal] = useState(false);
  const [customRange, setCustomRange] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedFormats, setSelectedFormats] = useState(
    Object.fromEntries(summaryReports.map((r) => [r.id, r.defaultFormat]))
  );

  const handleFormatSelect = (reportId, format) => {
    setSelectedFormats((prev) => ({ ...prev, [reportId]: format }));
    setOpenDropdownId(null);
  };

  const handleDownload = (report) => {
    // Placeholder — wire up to real generated file download later.
    alert(`Downloading "${report.title}" as ${selectedFormats[report.id]}`);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
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

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="normal" stroke="#1f9d6e" fill="#1f9d6e" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="critical" stroke="#dc2626" fill="#dc2626" fillOpacity={0.12} strokeWidth={2} />
                <Area type="monotone" dataKey="warning" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* STATUS DISTRIBUTION */}
          <div className="distribution-card">
            <h3>Farm status distribution</h3>

            {statusDistribution.map((s) => (
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