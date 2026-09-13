import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useFirestoreCollection } from "./useFirestoreCollection";

export function useUsers() {
  const { items: users, loading, error } = useFirestoreCollection("users");

  const addUser = async (userData) => {
    await addDoc(collection(db, "users"), {
      ...userData,
      status: "Active",
      lastSeen: "Just added",
      archived: false,
    });
  };

  const updateUser = async (id, updates) => {
    await updateDoc(doc(db, "users", id), updates);
  };

  const archiveUser = (id) => updateUser(id, { archived: true });
  const restoreUser = (id) => updateUser(id, { archived: false });
  const deleteUser = (id) => deleteDoc(doc(db, "users", id));

  return { users, loading, error, addUser, updateUser, archiveUser, restoreUser, deleteUser };
}