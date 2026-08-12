import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertTriangle, Calendar } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import { alerts } from "../data/alertsData";
import "./Alerts.css";
import DateRangeModal from "../components/DateRangeModal";

const statusLabel = { normal: "Normal", critical: "Critical", moderate: "Moderate", offline: "Offline" };

const timeFilters = [
  { key: "all", label: "All" },
  { key: "24h", label: "24h" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
];

function Alerts() {
  const navigate = useNavigate();
  const [activeTimeFilter, setActiveTimeFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [customRange, setCustomRange] = useState(null);

  const maxDays = { "24h": 1, "7d": 7, "30d": 30 };
  const filteredAlerts = alerts.filter((a) => {
  if (activeTimeFilter === "custom" && customRange) {
    return a.date >= customRange.from && a.date <= customRange.to;
  }
  if (activeTimeFilter === "all") return true;
  return a.daysAgo <= maxDays[activeTimeFilter];
});

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Alerts</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={18} />
              <span className="notif-badge">3</span>
            </button>
          </div>
        </div>

        <div className="alerts-card">
          <div className="alerts-toolbar">
            <h3>All alerts</h3>
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
          </div>

          {filteredAlerts.map((alert) => (
            <div className="alert-item" key={alert.id} onClick={() => setSelectedAlert(alert)}>
              <span className="icon-box icon-box-green">
                <AlertTriangle size={18} />
              </span>
              <div className="alert-item-body">
                <div className="alert-item-top">
                  <span className="alert-farm-name">{alert.farmName}</span>
                  <span className={"status-pill status-pill-" + alert.status}>
                    {statusLabel[alert.status]}
                  </span>
                </div>
                <p className="alert-message">
                  {alert.message}
                  {alert.trend && <> · <strong>{alert.trend}</strong></>}
                </p>
              </div>
              <span className="alert-time">{alert.displayTime}</span>
            </div>
          ))}
        </div>
      </main>

      {selectedAlert && (
        <Modal onClose={() => setSelectedAlert(null)}>
          <div className="alert-modal-content">
            <div className="alert-modal-header">
              <h2>{selectedAlert.farmName}</h2>
              <span className={"status-pill status-pill-" + selectedAlert.status}>
                {statusLabel[selectedAlert.status]}
              </span>
            </div>

            <hr />

            <div className="alert-modal-body">
              {selectedAlert.pond && <p className="alert-modal-pond">{selectedAlert.pond}</p>}
              <p className="alert-modal-message">
                <strong>{selectedAlert.riskLabel}</strong> - {selectedAlert.message}
                {selectedAlert.trend && <> -<strong>{selectedAlert.trend}</strong></>}
              </p>
              <p className="alert-modal-time">{selectedAlert.displayTime}</p>

              <div className="alert-modal-footer">
                <span
                  className="open-farm-link"
                  onClick={() => navigate(`/multi-farm/${selectedAlert.farmId}`)}
                >
                  Open farm →
                </span>
              </div>
            </div>
          </div>
          {showDateModal && (
            <DateRangeModal
                onClose={() => setShowDateModal(false)}
                onApply={(from, to) => {
                setCustomRange({ from, to });
                setActiveTimeFilter("custom");
                }}
            />
            )}
        </Modal>
      )}
    </div>
  );
}

export default Alerts;