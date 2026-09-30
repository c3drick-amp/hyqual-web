import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, remove } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, rtdb, userCreationAuth } from "../firebase";
import { useFirestoreCollection } from "./useFirestoreCollection";
import { logAuditEvent } from "../utils/auditLog";

function getUserLabel(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "User";
}

export function useUsers() {
  const { items: users, loading, error } = useFirestoreCollection("users");

  const addUser = async (userData) => {
    const { email, password, ...profileData } = userData;
    const userCredential = await createUserWithEmailAndPassword(
      userCreationAuth,
      email,
      password
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      ...profileData,
      email,
      status: "Active",
      lastSeen: "Just added",
      archived: false,
    });
    await logAuditEvent({
      type: "account",
      action: "created account",
      detail: `${getUserLabel(profileData)} (${profileData.role || "Unassigned role"})`,
    });
  };

  const updateUser = async (id, updates) => {
    await updateDoc(doc(db, "users", id), updates);
    const user = users.find((item) => item.id === id);
    await logAuditEvent({
      type: "account",
      action: "updated account",
      detail: `${getUserLabel(user)} (${user?.role || "Unassigned role"})`,
    });
  };

  const archiveUser = async (id) => {
    await updateDoc(doc(db, "users", id), { archived: true });
    const user = users.find((item) => item.id === id);
    await logAuditEvent({ type: "account", action: "archived account", detail: getUserLabel(user) });
  };

  const restoreUser = async (id) => {
    await updateDoc(doc(db, "users", id), { archived: false });
    const user = users.find((item) => item.id === id);
    await logAuditEvent({ type: "account", action: "restored account", detail: getUserLabel(user) });
  };

  const deleteUser = async (id) => {
    const user = users.find((item) => item.id === id);
    await deleteDoc(doc(db, "users", id));
    await remove(ref(rtdb, `presence/${id}`)).catch((error) => {
      console.error("Unable to remove deleted user's presence:", error);
    });
    await logAuditEvent({ type: "account", action: "deleted account", detail: getUserLabel(user) });
  };

  return { users, loading, error, addUser, updateUser, archiveUser, restoreUser, deleteUser };
}