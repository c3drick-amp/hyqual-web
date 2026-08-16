import { useState } from "react";
import { Bell } from "lucide-react";
import "./Profile.css";
import Sidebar from "../components/Sidebar";
import SuperadminSidebar from "../components/SuperadminSidebar";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("hyqual_user"));
  const isSuperadmin = storedUser?.role === "Superadmin";

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: storedUser?.firstName || "",
    middleName: storedUser?.middleName || "",
    lastName: storedUser?.lastName || "",
    mobile: storedUser?.mobile || "",
    email: storedUser?.email || "",
    street: storedUser?.street || "",
    barangay: storedUser?.barangay || "",
    city: storedUser?.city || "",
  });

  const initials = `${form.firstName[0] || ""}${form.lastName[0] || ""}`;

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSave = () => {
    // Merge edited fields back into the stored user so Sidebar/Dashboard reflect changes too
    const updatedUser = { ...storedUser, ...form };
    localStorage.setItem("hyqual_user", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert any unsaved edits back to what's actually stored
    setForm({
      firstName: storedUser?.firstName || "",
      middleName: storedUser?.middleName || "",
      lastName: storedUser?.lastName || "",
      mobile: storedUser?.mobile || "",
      email: storedUser?.email || "",
      street: storedUser?.street || "",
      barangay: storedUser?.barangay || "",
      city: storedUser?.city || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="dashboard-layout">
      {isSuperadmin ? <SuperadminSidebar /> : <Sidebar />}

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Profile</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={18} />
              <span className="notif-badge">3</span>
            </button>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-left">
            <div className="profile-avatar">{initials}</div>

            {!isEditing ? (
              <>
                <button className="profile-btn" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
                <button className="profile-btn">Change Password</button>
                <button className="profile-btn profile-btn-outline">Cancel</button>
              </>
            ) : (
              <>
                <button className="profile-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="profile-btn profile-btn-outline" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
          </div>

          <div className="profile-right">
            <h3>Personal Details</h3>

            <div className="profile-fields-row">
              <div className="profile-field">
                <label>First Name</label>
                <input
                  value={form.firstName}
                  disabled={!isEditing}
                  onChange={handleChange("firstName")}
                />
              </div>
              <div className="profile-field">
                <label>Middle Name</label>
                <input
                  value={form.middleName}
                  disabled={!isEditing}
                  onChange={handleChange("middleName")}
                />
              </div>
              <div className="profile-field">
                <label>Last Name</label>
                <input
                  value={form.lastName}
                  disabled={!isEditing}
                  onChange={handleChange("lastName")}
                />
              </div>
            </div>

            <div className="profile-fields-row">
              <div className="profile-field">
                <label>Mobile Number</label>
                <input
                  value={form.mobile}
                  disabled={!isEditing}
                  onChange={handleChange("mobile")}
                />
              </div>
              <div className="profile-field">
                <label>Email Address</label>
                <input
                  value={form.email}
                  disabled={!isEditing}
                  onChange={handleChange("email")}
                />
              </div>
            </div>

            <h3 className="address-heading">Address</h3>

            <div className="profile-fields-row">
              <div className="profile-field">
                <label>Street</label>
                <input
                  value={form.street}
                  disabled={!isEditing}
                  onChange={handleChange("street")}
                />
              </div>
              <div className="profile-field">
                <label>Barangay</label>
                <input
                  value={form.barangay}
                  disabled={!isEditing}
                  onChange={handleChange("barangay")}
                />
              </div>
              <div className="profile-field">
                <label>City</label>
                <input
                  value={form.city}
                  disabled={!isEditing}
                  onChange={handleChange("city")}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;