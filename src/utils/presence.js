import { ref, set } from "firebase/database";
import { rtdb } from "../firebase";

export function markUserOffline(uid) {
  if (!uid) return Promise.resolve();

  return set(ref(rtdb, `presence/${uid}`), {
    state: "offline",
    lastChanged: { ".sv": "timestamp" },
  });
}