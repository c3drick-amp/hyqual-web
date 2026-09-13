import { useState } from "react";
import { Bell, Search, Wifi, WifiOff } from "lucide-react";
import SuperadminSidebar from "../../components/SuperadminSidebar";
import { initialDevices } from "../../data/devicesData";
import { DEVICE_SENSORS, useDeviceStatus } from "../../hooks/useDeviceStatus";
import { LIVE_DEVICE_TARGET } from "../../data/liveDeviceConfig";
import { farms } from "../../data/farmsData";
import "../Dashboard.css";
import "./SuperadminOverview.css";
import "./DeviceRegistry.css";

const filters = ["All", "Online", "Offline", "Unassigned"];

function DeviceRegistry() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { batteryPercent, sensorStatus, assignment } = useDeviceStatus();
  const liveAssignment = assignment || LIVE_DEVICE_TARGET;
  const assignedFarm = farms.find((farm) => farm.id === liveAssignment.farmId);
  const assignedPond = assignedFarm?.ponds.find((pond) => pond.id === liveAssignment.pondId);

  const devices = initialDevices.map((device, index) => {
    if (index !== 0) return device;

    const onlineSensors = DEVICE_SENSORS.filter(({ key }) => sensorStatus[key]?.online).length;
    return {
      ...device,
      status: Object.keys(sensorStatus).length === 0
        ? device.status
        : onlineSensors === DEVICE_SENSORS.length ? "Online" : "Offline",
      farm: assignedFarm?.name || device.farm,
      pond: assignedPond?.name || device.pond,
      batteryPercent,
      sensorStatus,
    };
  });

  const filteredDevices = devices.filter((d) => {
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
            <span>BATTERY</span>
            <span>SENSORS</span>
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
              <span className="dr-muted">
                {device.batteryPercent == null ? "—" : `${device.batteryPercent}%`}
              </span>
              <span className="dr-sensor-health">
                {device.sensorStatus ? DEVICE_SENSORS.map(({ key, label }) => (
                  <span
                    className={"dr-sensor-dot " + (device.sensorStatus[key]?.online ? "dr-sensor-online" : "dr-sensor-offline")}
                    title={`${label}: ${device.sensorStatus[key]?.online ? "Online" : "Offline"}`}
                    key={key}
                  >
                    {label}
                  </span>
                )) : "—"}
              </span>
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