import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Activity,
  MapPin,
  AlertTriangle,
  BarChart2,
  Settings,
  LogOut,
  Bell,
  Building2,
  WifiOff,
  CheckSquare,
  AlertCircle,
} from "lucide-react";
import logoIcon from "../assets/hyqual-logo-icon.png";
import logoText from "../assets/hyqual-logo-text.png";
import { farmStats, recentWarnings, currentUser } from "../data/dashboardData";
import "./Dashboard.css";

function Dashboard() {
  const navItems = [
    { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { label: "Multi-Farm Monitoring", icon: Activity, path: "/multi-farm" },
    { label: "Farm Location Map", icon: MapPin, path: "/farm-map" },
    { label: "Hybrid Early Warning", icon: AlertTriangle, path: "/early-warning" },
    { label: "Reports and Analytics", icon: BarChart2, path: "/reports" },
  ];

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <img src={logoIcon} alt="HyQual icon" className="sidebar-logo-icon" />
            <img src={logoText} alt="HyQual" className="sidebar-logo-text" />
          </div>

          <p className="sidebar-role-label">BFAR ADMINISTRATOR</p>

          <nav>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  "nav-item" + (isActive ? " nav-item-active" : "")
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <a href="#" className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </a>

          <div className="user-card">
            <div className="user-avatar">{currentUser.initials}</div>
            <div>
              <p className="user-name">{currentUser.name}</p>
              <p className="user-role">{currentUser.role}</p>
            </div>
          </div>

          <a href="#" className="nav-item sign-out">
            <LogOut size={18} />
            <span>Sign out</span>
          </a>
        </div>
      </aside>

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

        {/* STAT CARDS ROW 1 */}
        <div className="stat-cards-row">
          <div className="stat-card">
            <div className="stat-card-top">
              <span>Registered farms</span>
              <Building2 size={18} />
            </div>
            <h2>{farmStats.registered}</h2>
            <p>Total participating shrimp farms</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Active farms</span>
              <Activity size={18} />
            </div>
            <h2>{farmStats.active}</h2>
            <p>Currently in operation</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Offline</span>
              <WifiOff size={18} />
            </div>
            <h2>{farmStats.offline}</h2>
            <p>Not transmitting to cloud</p>
          </div>
        </div>

        {/* STAT CARDS ROW 2 + WARNINGS PANEL */}
        <div className="stat-cards-row row-with-panel">
          <div className="stat-cards-col">
            <div className="stat-card">
              <div className="stat-card-top">
                <span>Normal</span>
                <CheckSquare size={18} />
              </div>
              <h2>{farmStats.normal}</h2>
              <p>Within acceptable water quality</p>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span>Critical</span>
                <AlertCircle size={18} />
              </div>
              <h2>{farmStats.critical}</h2>
              <p>Requires immediate attention</p>
            </div>
          </div>

          <div className="warnings-panel">
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
        </div>

        {/* Part 2 (map + recent monitoring activity) goes below — coming next */}
      </main>
    </div>
  );
}

export default Dashboard;