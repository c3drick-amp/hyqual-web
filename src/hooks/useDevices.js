import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("useDevices: Setting up listener for 'devices' collection");
    const q = query(collection(db, "devices"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("useDevices: Snapshot received, docs:", snapshot.docs.length);
      const deviceList = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Extract device ID from doc ID (remove "device_" prefix)
        const deviceId = doc.id.replace("device_", "");
        return {
          id: deviceId,
          name: data.deviceName,
          status: data.status,
          farm: data.farmId,
          pond: data.pondId,
          registered: data.installedAt ? new Date(data.installedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null,
          farmId: data.farmId,
          pondId: data.pondId,
        };
      });
      console.log("useDevices: Device list:", deviceList);
      setDevices(deviceList);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching devices:", err);
      setError(err);
      setLoading(false);
    });

    return () => {
      console.log("useDevices: Cleaning up listener");
      unsubscribe();
    };
  }, []);

  return { devices, loading, error };
}