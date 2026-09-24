import { useState } from "react";
import { Bell } from "lucide-react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase";
import "./Profile.css";
import Sidebar from "../components/Sidebar";
import SuperadminSidebar from "../components/SuperadminSidebar";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("hyqual_user"));
  const isSuperadmin = storedUser?.role === "Superadmin";

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
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

  const initials = `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`;

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSave = () => {
    const updatedUser = { ...storedUser, ...form };
    localStorage.setItem("hyqual_user", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (!auth.currentUser) {
      setPasswordError("You need to be logged in to change your password.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      setPasswordSuccess("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (err) {
      console.error("Password change error:", err);
      const message =
        err?.code === "auth/wrong-password"
          ? "Current password is incorrect."
          : "Unable to change password. Please try again.";
      setPasswordError(message);
    }
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
                <button
                  className="profile-btn"
                  onClick={() => {
                    setShowPasswordForm((prev) => !prev);
                    setPasswordError("");
                    setPasswordSuccess("");
                  }}
                >
                  Change Password
                </button>
              </>
            ) : (
              <>
                <button className="profile-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button
                  className="profile-btn profile-btn-outline"
                  onClick={handleCancel}
                >
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

            {showPasswordForm && (
              <form className="password-change-form" onSubmit={handlePasswordChange}>
                <h3>Change Password</h3>

                <div className="profile-fields-row">
                  <div className="profile-field">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="profile-field">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="profile-field">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {passwordError && <p className="login-error">{passwordError}</p>}
                {passwordSuccess && <p className="login-success">{passwordSuccess}</p>}

                <div className="password-form-actions">
                  <button type="submit" className="profile-btn">
                    Update Password
                  </button>
                  <button
                    type="button"
                    className="profile-btn profile-btn-outline"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordError("");
                      setPasswordSuccess("");
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    Close
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;