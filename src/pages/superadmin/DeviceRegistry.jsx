import { useState } from "react";
import { Bell, Search, Wifi, WifiOff } from "lucide-react";
import SuperadminSidebar from "../../components/SuperadminSidebar";
import { initialDevices } from "../../data/devicesData";
import "../Dashboard.css";
import "./SuperadminOverview.css";
import "./DeviceRegistry.css";

const filters = ["All", "Online", "Offline", "Unassigned"];

function DeviceRegistry() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDevices = initialDevices.filter((d) => {
    if (activeFilter !== "All" && d.status !== activeFilter) return false;
    const search = searchTerm.toLowerCase();
    if (!d.name.toLowerCase().includes(search) && !d.id.toLowerCase().includes(search)) return false;
    return true;
  });

  return (
    <div className="dashboard-layout">
      <SuperadminSidebar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Device Registry</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={18} />
              <span className="notif-badge">3</span>
            </button>
            <span className="superadmin-badge">SUPERADMIN</span>
          </div>
        </div>

        <div className="dr-toolbar">
          <div className="filter-pills">
            {filters.map((f) => (
              <button
                key={f}
                className={"filter-pill" + (activeFilter === f ? " filter-pill-active" : "")}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="search-box dr-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search device name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="dr-table-card">
          <div className="dr-table-header-row">
            <span>DEVICE ID</span>
            <span>DEVICE NAME</span>
            <span>STATUS</span>
            <span>ASSIGNED FARM</span>
            <span>ASSIGNED POND</span>
            <span>REGISTERED</span>
          </div>

          {filteredDevices.map((device) => (
            <div className="dr-table-row" key={device.id}>
              <span className="dr-device-id">{device.id}</span>
              <span>{device.name}</span>

              <span>
                <span className={"device-status-pill device-status-" + device.status.toLowerCase()}>
                  {device.status === "Online" && <Wifi size={12} />}
                  {device.status === "Offline" && <WifiOff size={12} />}
                  {device.status}
                </span>
              </span>

              <span className="dr-muted">{device.farm || "—"}</span>
              <span className="dr-muted">{device.pond || "—"}</span>
              <span className="dr-muted">{device.registered || "—"}</span>
            </div>
          ))}

          {filteredDevices.length === 0 && (
            <p className="dr-empty">No devices match this filter.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default DeviceRegistry;