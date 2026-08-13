import { useState, useEffect } from "react";
import { initialUsers } from "../data/usersData";

const STORAGE_KEY = "hyqual_users";

function loadUsers() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
  return initialUsers;
}

// Shared across User Management + Archived Accounts, backed by localStorage
// so archiving/restoring/deleting on one page is reflected on the other.
export function useUsers() {
  const [users, setUsers] = useState(loadUsers);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const addUser = (userData) => {
    setUsers((prev) => [
      ...prev,
      { ...userData, id: Date.now(), status: "Active", lastSeen: "Just added", archived: false },
    ]);
  };

  const updateUser = (id, updates) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const archiveUser = (id) => updateUser(id, { archived: true });
  const restoreUser = (id) => updateUser(id, { archived: false });
  const deleteUser = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));

  return { users, addUser, updateUser, archiveUser, restoreUser, deleteUser };
}