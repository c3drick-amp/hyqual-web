import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { onDisconnect, onValue, ref, set } from "firebase/database";
import { auth, rtdb } from "../firebase";

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
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      unsubscribeConnection?.();
      unsubscribeConnection = undefined;
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