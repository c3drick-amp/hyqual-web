import { useState } from "react";
import { Bell, Calendar, LogIn, FileText, UserPlus, Download } from "lucide-react";
import SuperadminSidebar from "../../components/SuperadminSidebar";
import DateRangeModal from "../../components/DateRangeModal";
import { auditLogs } from "../../data/auditLogsData";
import "../Dashboard.css";
import "./SuperadminOverview.css";
import "./AuditLogs.css";

const timeFilters = [
  { key: "all", label: "All" },
  { key: "24h", label: "24h" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
];

const iconByType = { signin: LogIn, export: FileText, account: UserPlus };

function AuditLogs() {
  const [activeTimeFilter, setActiveTimeFilter] = useState("all");
  const [showDateModal, setShowDateModal] = useState(false);
  const [customRange, setCustomRange] = useState(null);

  const maxDays = { "24h": 1, "7d": 7, "30d": 30 };

  const filteredLogs = auditLogs.filter((log) => {
    if (activeTimeFilter === "custom" && customRange) {
      return log.date >= customRange.from && log.date <= customRange.to;
    }
    if (activeTimeFilter === "all") return true;
    return log.daysAgo <= maxDays[activeTimeFilter];
  });

  const handleExport = () => {
    // Placeholder — wire up to real log export/download later.
    alert("Exporting audit log...");
  };

  return (
    <div className="dashboard-layout">
      <SuperadminSidebar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Activity Logs</h1>
            <p className="header-subtext">Audit trail of monitoring activity, notifications, and user actions</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={18} />
              <span className="notif-badge">3</span>
            </button>
            <span className="superadmin-badge">SUPERADMIN</span>
          </div>
        </div>

        <div className="al-toolbar">
          <div className="time-filter-group">
            {timeFilters.map((f) => (
              <button
                key={f.key}
                className={"time-filter-btn" + (activeTimeFilter === f.key ? " time-filter-active" : "")}
                onClick={() => setActiveTimeFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
            <button className="time-filter-btn custom-btn" onClick={() => setShowDateModal(true)}>
              <Calendar size={14} /> Custom
            </button>
          </div>

          <button className="export-log-btn" onClick={handleExport}>
            <FileText size={14} /> Export log
          </button>
        </div>

        <div className="al-list-card">
          {filteredLogs.map((log) => {
            const Icon = iconByType[log.type] || FileText;
            return (
              <div className="al-item" key={log.id}>
                <span className="icon-box icon-box-green">
                  <Icon size={16} />
                </span>
                <p className="al-text">
                  <strong>{log.actor}</strong> · {log.action}{" "}
                  <strong>{log.detail}</strong>
                </p>
                <span className="al-time">{log.displayTime}</span>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <p className="al-empty">No activity in this range.</p>
          )}
        </div>
      </main>

      {showDateModal && (
        <DateRangeModal
          onClose={() => setShowDateModal(false)}
          onApply={(from, to) => {
            setCustomRange({ from, to });
            setActiveTimeFilter("custom");
          }}
        />
      )}
    </div>
  );
}

export default AuditLogs;