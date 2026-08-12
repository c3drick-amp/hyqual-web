import { Bell, Users, Activity } from "lucide-react";
import SuperadminSidebar from "../../components/SuperadminSidebar";
import { superadminStats } from "../../data/superadminData";
import "../Dashboard.css";
import "./SuperadminOverview.css";

function SuperadminOverview() {
  return (
    <div className="dashboard-layout">
      <SuperadminSidebar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Superadmin Overview</h1>
            <p className="header-subtext">Manage administrator accounts and audit system activity</p>
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={18} />
              <span className="notif-badge">3</span>
            </button>
            <span className="superadmin-badge">SUPERADMIN</span>
          </div>
        </div>

        <div className="sa-stats-row">
          <div className="stat-card">
            <div className="stat-card-top">
              <span>BFAR Administrators</span>
              <span className="icon-box icon-box-green">
                <Users size={18} />
              </span>
            </div>
            <h2>{superadminStats.bfarAdmins}</h2>
            <p>Active accounts</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Farm Owners</span>
              <span className="icon-box icon-box-green">
                <Activity size={18} />
              </span>
            </div>
            <h2>{superadminStats.farmOwners}</h2>
            <p>Farm-scoped access</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SuperadminOverview;