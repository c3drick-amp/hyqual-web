import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export async function logAuditEvent({ type, action, detail }) {
  const storedUser = JSON.parse(localStorage.getItem("hyqual_user") || "null") || {};
  const currentUser = auth.currentUser;
  const actorId = currentUser?.uid || storedUser.uid;

  if (!actorId) return;

  try {
    await addDoc(collection(db, "auditLogs"), {
      actorId,
      actor: [storedUser.firstName, storedUser.lastName].filter(Boolean).join(" ") || currentUser?.email || "Unknown user",
      actorRole: storedUser.role || "Unknown",
      type,
      action,
      detail,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Unable to write audit log:", error);
  }
}