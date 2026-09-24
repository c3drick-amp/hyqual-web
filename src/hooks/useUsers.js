import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, userCreationAuth } from "../firebase";
import { useFirestoreCollection } from "./useFirestoreCollection";

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
  };

  const updateUser = async (id, updates) => {
    await updateDoc(doc(db, "users", id), updates);
  };

  const archiveUser = (id) => updateUser(id, { archived: true });
  const restoreUser = (id) => updateUser(id, { archived: false });
  const deleteUser = (id) => deleteDoc(doc(db, "users", id));

  return { users, loading, error, addUser, updateUser, archiveUser, restoreUser, deleteUser };
}