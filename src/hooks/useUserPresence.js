import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { onDisconnect, onValue, ref, set } from "firebase/database";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db, rtdb } from "../firebase";
import { markUserOffline } from "../utils/presence";

export function useUserPresence(trackCurrentUser = true) {
  const [presence, setPresence] = useState({});

  useEffect(() => {
    const presenceRef = ref(rtdb, "presence");
    const unsubscribePresence = onValue(presenceRef, (snapshot) => {
      setPresence(snapshot.val() || {});
    });

    if (!trackCurrentUser) {
      return () => unsubscribePresence();
    }

    let unsubscribeConnection;
    let activeUid = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (activeUid && activeUid !== user?.uid) {
        markUserOffline(activeUid).catch((error) => {
          console.error("Unable to update user presence:", error);
        });
      }
      unsubscribeConnection?.();
      unsubscribeConnection = undefined;
      activeUid = user?.uid || null;
      if (!user) return;

      const userPresenceRef = ref(rtdb, `presence/${user.uid}`);
      const connectedRef = ref(rtdb, ".info/connected");
      unsubscribeConnection = onValue(connectedRef, async (snapshot) => {
        if (snapshot.val() !== true) return;

        await onDisconnect(userPresenceRef).set({
          state: "offline",
          lastChanged: { ".sv": "timestamp" },
        });
        await set(userPresenceRef, {
          state: "online",
          lastChanged: { ".sv": "timestamp" },
        });
        updateDoc(doc(db, "users", user.uid), { lastSeen: serverTimestamp() }).catch((error) => {
          console.error("Unable to update last seen:", error);
        });
      });

      return unsubscribeConnection;
    });

    return () => {
      unsubscribePresence();
      unsubscribeAuth();
      unsubscribeConnection?.();
    };
  }, [trackCurrentUser]);

  return presence;
}