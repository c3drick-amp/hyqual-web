import { useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { X } from "lucide-react";
import { Bell } from "lucide-react";
import SuperadminSidebar from "../../components/SuperadminSidebar";
import Modal from "../../components/Modal";
import { db } from "../../firebase";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import "../Dashboard.css";
import "./SuperadminOverview.css";
import "./AccountApproval.css";

const tabs = ["All", "BFAR Admin", "Farm Owner"];

function AccountApproval() {
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState(null);
  const { items: approvals, loading, error } = useFirestoreCollection("approvals");

  const filteredApprovals = approvals.filter(
    (a) => activeTab === "All" || a.role === activeTab
  );

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "approvals", id), { status: "Approved", approvedAt: new Date().toISOString() });
    setSelected(null);
  };

  const handleReject = async (id) => {
    await deleteDoc(doc(db, "approvals", id));
    setSelected(null);
  };

  if (loading) return <p style={{ padding: 40 }}>Loading approvals...</p>;
  if (error) return <p style={{ padding: 40 }}>Unable to load approvals from Firebase.</p>;

  return (
    <div className="dashboard-layout">
      <SuperadminSidebar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Account Approval</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={18} />
              <span className="notif-badge">3</span>
            </button>
            <span className="superadmin-badge">SUPERADMIN</span>
          </div>
        </div>

        <div className="filter-pills" style={{ marginBottom: 20 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={"filter-pill" + (activeTab === tab ? " filter-pill-active" : "")}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="approval-list">
          {filteredApprovals.length === 0 && (
            <p className="approval-empty">No pending approvals in this category.</p>
          )}

          {filteredApprovals.map((acc) => (
            <div className="approval-card" key={acc.id} onClick={() => setSelected(acc)}>
              <div className="approval-card-main">
                <div className="approval-card-top">
                  <h3>{acc.firstName} {acc.lastName}</h3>
                  <span className="role-pill">{acc.role}</span>
                </div>
                {acc.farmName && <p className="approval-farm-name">{acc.farmName}</p>}
                <div className="approval-meta-row">
                  <span>{acc.barangay}, {acc.city}</span>
                  <span>{acc.email}</span>
                  <span>{acc.phone}</span>
                  <span>{acc.submittedAt}</span>
                </div>
              </div>

              <div className="approval-card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="approval-reject-btn" onClick={() => handleReject(acc.id)}>
                  <X size={14} /> Reject
                </button>
                <button className="approval-approve-btn" onClick={() => handleApprove(acc.id)}>
                  ✓ Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="approval-modal-content">
            <div className="approval-modal-header">
              <div className="approval-modal-avatar">
                {selected.firstName[0]}{selected.lastName[0]}
              </div>
              <div>
                <h2>{selected.firstName} {selected.lastName}</h2>
                <span className="role-pill">{selected.role}</span>
              </div>
            </div>

            <p className="approval-modal-status">
              Submitted {selected.submittedAt} — Pending verification
            </p>

            {selected.farmName && (
              <>
                <p className="approval-section-label">FARM INFORMATION</p>
                <div className="approval-detail-row">
                  <span>Farm name</span>
                  <strong>{selected.farmName}</strong>
                </div>
                <div className="approval-detail-row">
                  <span>Registered ponds</span>
                  <strong>{selected.pondCount} ponds listed</strong>
                </div>
              </>
            )}

            <p className="approval-section-label">CONTACT DETAILS</p>
            <div className="approval-detail-row">
              <span>Location</span>
              <strong>{selected.barangay}, {selected.city}</strong>
            </div>
            <div className="approval-detail-row">
              <span>Email</span>
              <strong>{selected.email}</strong>
            </div>
            <div className="approval-detail-row">
              <span>Phone</span>
              <strong>{selected.phone}</strong>
            </div>

            <div className="approval-modal-footer">
              <button className="approval-modal-reject-btn" onClick={() => handleReject(selected.id)}>
                Reject
              </button>
              <button className="approval-modal-approve-btn" onClick={() => handleApprove(selected.id)}>
                Approve
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AccountApproval;