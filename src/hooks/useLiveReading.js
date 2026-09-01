import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";

// The device stores each parameter as: paramName -> "YYYY-MM-DD" -> "HHMM" -> { value, ... }
// This walks that nested tree and returns just the single most recent reading.
function getLatestEntry(paramTree) {
  if (!paramTree) return null;

  let latestCreatedAt = null;
  let latestEntry = null;

  Object.values(paramTree).forEach((dateNode) => {
    Object.values(dateNode).forEach((entry) => {
      if (!latestCreatedAt || entry.createdAt > latestCreatedAt) {
        latestCreatedAt = entry.createdAt;
        latestEntry = entry;
      }
    });
  });

  return latestEntry;
}

// PLACEHOLDER conversion — replace with the exact EC-to-salinity method cited in
// your document/references. This is a rough approximation for demo purposes only.
function ecToSalinity(ecMillisiemensPerCm) {
  if (ecMillisiemensPerCm == null) return null;
  return Math.round(ecMillisiemensPerCm * 0.64 * 100) / 100;
}

// Subscribes to live device data and returns the latest combined reading,
// updating automatically whenever the device sends something new.
export function useLiveReading() {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paramsToWatch = ["temperature", "ph", "do", "ec"];
    const latestByParam = {};

    const unsubscribers = paramsToWatch.map((param) =>
      onValue(ref(rtdb, param), (snapshot) => {
        latestByParam[param] = getLatestEntry(snapshot.val());

        // Only publish once we've heard from every parameter at least once
        if (paramsToWatch.every((p) => latestByParam[p] !== undefined)) {
          setReading({
            temp: latestByParam.temperature?.value ?? null,
            ph: latestByParam.ph?.value ?? null,
            do: latestByParam.do?.value ?? null,
            sal: ecToSalinity(latestByParam.ec?.value),
            lastUpdated: latestByParam.temperature?.createdAt ?? null,
          });
          setLoading(false);
        }
      })
    );

    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  return { reading, loading };
}