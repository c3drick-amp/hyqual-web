import { useParams, useNavigate } from "react-router-dom";
import { Bell, Sprout } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { farms } from "../data/farmsData";
import { getOverallStatus } from "../data/thresholds";
import "./FarmDetails.css";

const statusLabel = { normal: "Normal", critical: "Critical", moderate: "Moderate", offline: "Offline" };

function FarmDetails() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const farm = farms.find((f) => f.id === Number(farmId));

  if (!farm) return <p style={{ padding: 40 }}>Farm not found.</p>;

  const mainPond = farm.ponds[0];
  const overallStatus = getOverallStatus({
    temp: mainPond.temp, ph: mainPond.ph, do: mainPond.do, sal: mainPond.sal,
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Multi-Farm Monitoring</h1>
            <p className="header-subtext">{farms.length} registered farms</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={18} />
              <span className="notif-badge">3</span>
            </button>
            <button className="view-farms-btn">+ Register farm</button>
          </div>
        </div>

        <div className="farm-summary-card">
          <div className="farm-summary-top">
            <h2>{farm.name}</h2>
            <span className={"status-pill status-pill-" + overallStatus}>
              {statusLabel[overallStatus]}
            </span>
          </div>
          <p>Operator: {farm.owner}</p>
          <p>Location: {farm.location}</p>
          <p>Ponds: {farm.ponds.length}</p>
          <p>Updated {farm.updatedAt}</p>
        </div>

        <h3 className="ponds-heading">Ponds</h3>

        <div className="ponds-grid">
          {farm.ponds.map((pond) => {
            const pondStatus = getOverallStatus({
              temp: pond.temp, ph: pond.ph, do: pond.do, sal: pond.sal,
            });
            return (
              <div
                className={"pond-card pond-card-" + pondStatus}
                key={pond.id}
                onClick={() => navigate(`/multi-farm/${farm.id}/${pond.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="pond-card-header">
                  <span className="pond-title">
                    <Sprout size={16} /> {pond.name}
                  </span>
                  <span className={"status-dot status-dot-" + pondStatus} />
                </div>
                <div className="pond-readings">
                  <span><strong>Temp:</strong> {pond.temp} °C</span>
                  <span><strong>pH:</strong> {pond.ph}</span>
                  <span><strong>DO:</strong> {pond.do} mg/L</span>
                  <span><strong>Salinity:</strong> {pond.sal} ppt</span>
                </div>
              </div>
            );
          })}
        </div>

        <button className="back-btn" onClick={() => navigate("/multi-farm")}>
          Back
        </button>
      </main>
    </div>
  );
}

export default FarmDetails;