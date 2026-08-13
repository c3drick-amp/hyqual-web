import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, UserPlus, Archive, Search, ChevronDown, Pencil, Trash2 } from "lucide-react";
import SuperadminSidebar from "../../components/SuperadminSidebar";
import UserFormModal from "../../components/UserFormModal";
import ConfirmModal from "../../components/ConfirmModal";
import { useUsers } from "../../hooks/useUsers";
import "../Dashboard.css";
import "./SuperadminOverview.css";
import "./UserManagement.css";

const roleOptions = ["All users", "BFAR Admin", "Farm Owner"];
const statusOptions = ["All", "Active", "Deactivated"];

function UserManagement() {
  const navigate = useNavigate();
  const { users, addUser, updateUser, archiveUser } = useUsers();

  const [roleFilter, setRoleFilter] = useState("All users");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  const [formModal, setFormModal] = useState(null); // { mode: "add"|"edit", user? }
  const [confirmArchive, setConfirmArchive] = useState(null); // user being archived

  const activeUsers = users.filter((u) => !u.archived);

  const filteredUsers = activeUsers.filter((u) => {
    if (roleFilter !== "All users" && u.role !== roleFilter) return false;
    if (statusFilter !== "All" && u.status !== statusFilter) return false;
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    if (!fullName.includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleAddSubmit = (formData) => addUser(formData);
  const handleEditSubmit = (formData) => updateUser(formModal.user.id, formData);

  return (
    <div className="dashboard-layout">
      <SuperadminSidebar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Users &amp; Roles</h1>
            <p className="header-subtext">Role-based access for BFAR personnel and farm operators</p>
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={18} />
              <span className="notif-badge">3</span>
            </button>
            <span className="superadmin-badge">SUPERADMIN</span>
            <button className="add-user-btn" onClick={() => setFormModal({ mode: "add" })}>
              <UserPlus size={16} /> Add user
            </button>
          </div>
        </div>

        <div className="um-toolbar">
          <button className="archive-toolbar-btn" onClick={() => navigate("/superadmin/users/archived")}>
            <Archive size={14} /> Archive
          </button>

          <div className="um-filters">
            <div className="dropdown-wrapper">
              <button
                className="filter-dropdown-btn"
                onClick={() => setOpenDropdown(openDropdown === "role" ? null : "role")}
              >
                ROLE: {roleFilter} <ChevronDown size={14} />
              </button>
              {openDropdown === "role" && (
                <div className="filter-dropdown-menu">
                  {roleOptions.map((opt) => (
                    <button key={opt} onClick={() => { setRoleFilter(opt); setOpenDropdown(null); }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="dropdown-wrapper">
              <button
                className="filter-dropdown-btn"
                onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
              >
                STATUS: {statusFilter} <ChevronDown size={14} />
              </button>
              {openDropdown === "status" && (
                <div className="filter-dropdown-menu">
                  {statusOptions.map((opt) => (
                    <button key={opt} onClick={() => { setStatusFilter(opt); setOpenDropdown(null); }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="search-box um-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="um-table-card">
          <div className="um-table-header-row">
            <span>USER</span>
            <span>ROLE</span>
            <span>FARM</span>
            <span>STATUS</span>
            <span>LAST SEEN</span>
            <span></span>
          </div>

          {filteredUsers.map((user) => (
            <div className="um-table-row" key={user.id}>
              <div className="um-user-cell">
                <div className="user-avatar">{user.firstName[0]}{user.lastName[0]}</div>
                <div>
                  <p className="um-user-name">{user.firstName} {user.lastName}</p>
                  <p className="um-user-email">{user.email}</p>
                </div>
              </div>

              <span><span className="role-pill">{user.role}</span></span>

              <span className="um-farm-cell">{user.farmName || "—"}</span>

              <span>
                <span className={"status-dot-text status-dot-text-" + (user.status === "Active" ? "active" : "inactive")}>
                  {user.status}
                </span>
              </span>

              <span className="um-last-seen">{user.lastSeen}</span>

              <span className="um-row-actions">
                <button className="row-action-btn row-action-danger" onClick={() => setConfirmArchive(user)}>
                  <Trash2 size={16} />
                </button>
                <button className="row-action-btn" onClick={() => setFormModal({ mode: "edit", user })}>
                  <Pencil size={16} />
                </button>
              </span>
            </div>
          ))}
        </div>
      </main>

      {formModal?.mode === "add" && (
        <UserFormModal
          mode="add"
          onClose={() => setFormModal(null)}
          onSubmit={handleAddSubmit}
        />
      )}

      {formModal?.mode === "edit" && (
        <UserFormModal
          mode="edit"
          initialData={formModal.user}
          onClose={() => setFormModal(null)}
          onSubmit={handleEditSubmit}
          onArchiveClick={() => {
            setFormModal(null);
            setConfirmArchive(formModal.user);
          }}
        />
      )}

      {confirmArchive && (
        <ConfirmModal
          title="Archive this account?"
          message={`${confirmArchive.firstName} ${confirmArchive.lastName} will be moved to Archived Accounts. You can restore it anytime.`}
          confirmLabel="Archive"
          danger
          onClose={() => setConfirmArchive(null)}
          onConfirm={() => archiveUser(confirmArchive.id)}
        />
      )}
    </div>
  );
}

export default UserManagement;