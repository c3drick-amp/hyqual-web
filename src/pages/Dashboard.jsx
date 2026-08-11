import { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Activity,
  MapPin,
  AlertTriangle,
  BarChart2,
  LogOut,
  Bell,
  Building2,
  WifiOff,
  CheckSquare,
  AlertCircle,
  Waves,
  Layers,
} from "lucide-react";
import logoIcon from "../assets/hyqual-logo-icon.png";
import logoText from "../assets/hyqual-logo-text.png";
import { farmStats, recentWarnings, recentActivity } from "../data/dashboardData";
import { farms } from "../data/farmsData";
import { getOverallStatus } from "../data/thresholds";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import "./Dashboard.css";
import Sidebar from "../components/Sidebar";

const statusColor = { normal: "#1f9d6e", critical: "#dc2626", moderate: "#f59e0b", offline: "#6b7280" };
const CALAPAN_CENTER = { lat: 13.4117, lng: 121.1803 };

function Dashboard() {
  const navItems = [
    { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { label: "Multi-Farm Monitoring", icon: Activity, path: "/multi-farm" },
    { label: "Farm Location Map", icon: MapPin, path: "/farm-map" },
    { label: "Hybrid Early Warning", icon: AlertTriangle, path: "/early-warning" },
    { label: "Reports and Analytics", icon: BarChart2, path: "/reports" },
  ];

  const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem("hyqual_user"));
    const currentUser = storedUser || {
    name: "Guest",
    role: "Unknown",
    initials: "?",
    };

    const handleSignOut = () => {
    localStorage.removeItem("hyqual_user");
    navigate("/login");
    };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [statusFilter, setStatusFilter] = useState(null);

  const farmsWithStatus = farms.map((farm) => {
    const mainPond = farm.ponds[0];
    const status = getOverallStatus({
      temp: mainPond.temp, ph: mainPond.ph, do: mainPond.do, sal: mainPond.sal,
    });
    return { ...farm, status };
  });

  const visiblePins = farmsWithStatus.filter((farm) => {
    if (!showOverlay) return false;
    if (statusFilter && farm.status !== statusFilter) return false;
    return true;
  });

  const onMapLoad = (map) => { mapRef.current = map; };

  const handlePinClick = (farm) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: farm.lat, lng: farm.lng });
      mapRef.current.setZoom(15);
    }
  };
  
  const handleLegendClick = (status) => {
    // clicking the same status again turns the filter back off
    setStatusFilter((prev) => (prev === status ? null : status));
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
        <Sidebar />

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="header-subtext">
              Centralized monitoring of participating shrimp farms in Calapan City
            </p>
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={18} />
              <span className="notif-badge">3</span>
            </button>
            <button className="view-farms-btn">View all farms →</button>
          </div>
        </div>

        {/* MAIN GRID: 3 columns x 3 rows */}
        <div className="dashboard-grid">
          <div className="stat-card grid-registered">
            <div className="stat-card-top">
              <span>Registered farms</span>
              <span className="icon-box icon-box-green">
                <Building2 size={18} />
              </span>
            </div>
            <h2>{farmStats.registered}</h2>
            <p>Total participating shrimp farms</p>
          </div>

          <div className="stat-card grid-active">
            <div className="stat-card-top">
              <span>Active farms</span>
              <span className="icon-box icon-box-green">
                <Activity size={18} />
              </span>
            </div>
            <h2>{farmStats.active}</h2>
            <p>Currently in operation</p>
          </div>

          <div className="stat-card grid-offline">
            <div className="stat-card-top">
              <span>Offline</span>
              <span className="icon-box icon-box-gray">
                <WifiOff size={18} />
              </span>
            </div>
            <h2>{farmStats.offline}</h2>
            <p>Not transmitting to cloud</p>
          </div>

          <div className="stat-card grid-normal">
            <div className="stat-card-top">
              <span>Normal</span>
              <span className="icon-box icon-box-green">
                <CheckSquare size={18} />
              </span>
            </div>
            <h2>{farmStats.normal}</h2>
            <p>Within acceptable water quality</p>
          </div>

          <div className="stat-card grid-critical">
            <div className="stat-card-top">
              <span>Critical</span>
              <span className="icon-box icon-box-red">
                <AlertCircle size={18} />
              </span>
            </div>
            <h2>{farmStats.critical}</h2>
            <p>Requires immediate attention</p>
          </div>

          <div className="stat-card grid-moderate">
            <div className="stat-card-top">
              <span>Moderate</span>
              <span className="icon-box icon-box-orange">
                <AlertTriangle size={18} />
              </span>
            </div>
            <h2>{farmStats.moderate}</h2>
            <p>Requires closer monitoring</p>
          </div>

          <div className="warnings-panel grid-warnings">
            <div className="warnings-panel-header">
              <h3>Recent early warnings</h3>
              <a href="#">Open early warning</a>
            </div>

            {recentWarnings.map((w) => (
              <div className="warning-item" key={w.id}>
                <div className="warning-item-top">
                  <span className="warning-tag">{w.type}</span>
                  <span
                    className={
                      "warning-status " +
                      (w.status === "Critical" ? "status-critical" : "status-offline")
                    }
                  >
                    {w.status}
                  </span>
                </div>
                <p className="warning-farm">{w.farm}</p>
                <p className="warning-detail">{w.detail}</p>
                <p className="warning-action">Action: {w.action}</p>
                <p className="warning-time">{w.time}</p>
              </div>
            ))}
          </div>

          <div className="map-card grid-map">
            <div className="map-card-header">
              <div className="map-card-title">
                <MapPin size={16} />
                <span>Calapan City overview</span>
              </div>

              <button
                className={"overlay-btn" + (showOverlay ? " overlay-btn-active" : "")}
                onClick={() => setShowOverlay(!showOverlay)}
              >
                <Layers size={14} />
                Status overlay
              </button>
            </div>

            <div className="map-placeholder">
              {visiblePins.map((farm) => (
                <div
                  key={farm.id}
                  className={"map-pin map-pin-" + farm.status}
                  style={{ top: farm.top, left: farm.left }}
                  title={farm.name}
                />
              ))}

              <div className="map-placeholder">
                {isLoaded && (
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={CALAPAN_CENTER}
                    zoom={13}
                    onLoad={onMapLoad}
                    options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
                  >
                    {visiblePins.map((farm) => (
                      <Marker
                        key={farm.id}
                        position={{ lat: farm.lat, lng: farm.lng }}
                        onClick={() => handlePinClick(farm)}
                        icon={{
                          path: window.google.maps.SymbolPath.CIRCLE,
                          fillColor: statusColor[farm.status],
                          fillOpacity: 1,
                          strokeColor: "#ffffff",
                          strokeWeight: 2,
                          scale: 8,
                        }}
                      />
                    ))}
                  </GoogleMap>
                )}

                <div className="map-legend">
                  <button
                    className={"legend-btn" + (statusFilter === "normal" ? " legend-btn-active" : "")}
                    onClick={() => handleLegendClick("normal")}
                  >
                    <span className="legend-dot legend-normal" /> Normal
                  </button>
                  <button
                    className={"legend-btn" + (statusFilter === "critical" ? " legend-btn-active" : "")}
                    onClick={() => handleLegendClick("critical")}
                  >
                    <span className="legend-dot legend-critical" /> Critical
                  </button>
                  <button
                    className={"legend-btn" + (statusFilter === "moderate" ? " legend-btn-active" : "")}
                    onClick={() => handleLegendClick("moderate")}
                  >
                    <span className="legend-dot legend-moderate" /> Moderate
                  </button>
                  <button
                    className={"legend-btn" + (statusFilter === "offline" ? " legend-btn-active" : "")}
                    onClick={() => handleLegendClick("offline")}
                  >
                    <span className="legend-dot legend-offline" /> Offline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT MONITORING ACTIVITY */}
        <div className="activity-card">
          <div className="activity-header">
            <div>
              <h3>Recent monitoring activity</h3>
              <p>Latest monitoring activities from participating farms</p>
            </div>
            <a href="#">Open multi-farm view</a>
          </div>

          {recentActivity.map((item) => (
            <div className="activity-item" key={item.id}>
              <span className="icon-box icon-box-green">
                <Waves size={16} />
              </span>
              <div className="activity-text">
                <p>
                  <strong>{item.farm}</strong> · {item.action}
                </p>
              </div>
              <span className="activity-time">{item.time}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;