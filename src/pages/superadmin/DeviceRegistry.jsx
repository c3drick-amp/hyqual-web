import { useState, useMemo } from "react";
import { Bell, Search, Wifi, WifiOff } from "lucide-react";
import SuperadminSidebar from "../../components/SuperadminSidebar";
import { DEVICE_SENSORS, useDeviceStatus } from "../../hooks/useDeviceStatus";
import { useDevices } from "../../hooks/useDevices";
import { useFarms } from "../../hooks/useFarms";
import { LIVE_DEVICE_TARGET } from "../../config/liveDeviceConfig";
import "../Dashboard.css";
import "./SuperadminOverview.css";
import "./DeviceRegistry.css";

const filters = ["All", "Online", "Offline", "Unassigned"];

function DeviceRegistry() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { batteryPercent, sensorStatus, assignment } = useDeviceStatus();
  const { devices, loading: devicesLoading, error: devicesError } = useDevices();
  const { farms, loading: farmsLoading, error: farmsError } = useFarms();

  console.log("DeviceRegistry render:", { devices, farms, devicesLoading, farmsLoading, devicesError, farmsError });

  const liveAssignment = assignment || LIVE_DEVICE_TARGET;
  const liveFarm = farms.find((farm) => farm.id === String(liveAssignment.farmId));
  const livePond = liveFarm?.ponds.find((pond) => pond.id === liveAssignment.pondId);

  const enrichedDevices = useMemo(() => {
    return devices.map((device, index) => {
      const deviceFarm = farms.find((f) => f.id === device.farmId);
      const devicePond = deviceFarm?.ponds.find((p) => p.id === device.pondId);
      
      const baseDevice = {
        ...device,
        farm: deviceFarm?.name || device.farm || "—",
        pond: devicePond?.name || device.pond || "—",
      };

      if (index !== 0) return baseDevice;

      const onlineSensors = DEVICE_SENSORS.filter(({ key }) => sensorStatus[key]?.online).length;
      return {
        ...baseDevice,
        status: Object.keys(sensorStatus).length === 0
          ? device.status
          : onlineSensors === DEVICE_SENSORS.length ? "Online" : "Offline",
        farm: liveFarm?.name || deviceFarm?.name || device.farm || "—",
        pond: livePond?.name || devicePond?.name || device.pond || "—",
        batteryPercent,
        sensorStatus,
      };
    });
  }, [devices, farms, sensorStatus, batteryPercent, liveFarm, livePond]);

  const loading = devicesLoading || farmsLoading;

  const filteredDevices = enrichedDevices.filter((d) => {
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

          {loading ? (
            <div className="dr-loading">Loading devices...</div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default DeviceRegistry;