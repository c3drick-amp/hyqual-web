import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, Activity, MapPin, AlertTriangle, BarChart2, LogOut } from "lucide-react";
import logoIcon from "../assets/hyqual-logo-icon.png";
import logoText from "../assets/hyqual-logo-text.png";
import "./Sidebar.css";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { label: "Multi-Farm Monitoring", icon: Activity, path: "/multi-farm" },
  { label: "Farm Location Map", icon: MapPin, path: "/farm-map" },
  { label: "Alerts", icon: AlertTriangle, path: "/alerts" },
  { label: "Reports and Analytics", icon: BarChart2, path: "/reports" },
];

function Sidebar() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("hyqual_user"));
  const currentUser = storedUser || { name: "Guest", role: "Unknown", initials: "?" };

  const handleSignOut = () => {
    localStorage.removeItem("hyqual_user");
    navigate("/login");
  };

  return (
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
              className={({ isActive }) => "nav-item" + (isActive ? " nav-item-active" : "")}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="user-card" onClick={() => navigate("/profile")}>
          <div className="user-avatar">{currentUser.initials}</div>
          <div>
            <p className="user-name">{currentUser.name}</p>
            <p className="user-role">{currentUser.role}</p>
          </div>
        </div>

        <button className="nav-item sign-out" onClick={handleSignOut}>
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;