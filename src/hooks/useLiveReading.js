import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";
import { getOverallStatus } from "../data/thresholds";

// The device stores each parameter as: paramName -> "YYYY-MM-DD" -> "HHMM" -> { value, ... }
// This walks that nested tree and returns just the single most recent reading.
function getLatestEntry(paramTree) {
  if (!paramTree) return null;

  let latestCreatedAt = null;
  let latestEntry = null;

  Object.values(paramTree).forEach((dateNode) => {
    if (!dateNode) return;
    Object.values(dateNode).forEach((entry) => {
      if (!entry?.createdAt) return;
      if (!latestCreatedAt || entry.createdAt > latestCreatedAt) {
        latestCreatedAt = entry.createdAt;
        latestEntry = entry;
      }
    });
  });

  return latestEntry;
}

function getEntries(paramTree) {
  if (!paramTree) return [];

  return Object.values(paramTree).flatMap((dateNode) =>
    dateNode ? Object.values(dateNode).filter((entry) => entry?.createdAt) : []
  );
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
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paramsToWatch = ["temperature", "ph", "do", "ec"];
    const latestByParam = {};
    const entriesByParam = {};

    const unsubscribers = paramsToWatch.map((param) =>
      onValue(ref(rtdb, param), (snapshot) => {
        const paramTree = snapshot.val();
        latestByParam[param] = getLatestEntry(paramTree);
        entriesByParam[param] = getEntries(paramTree);

        // Only publish once we've heard from every parameter at least once
        if (paramsToWatch.every((p) => latestByParam[p] !== undefined)) {
          setReading({
            temp: latestByParam.temperature?.value ?? null,
            ph: latestByParam.ph?.value ?? null,
            do: latestByParam.do?.value ?? null,
            sal: ecToSalinity(latestByParam.ec?.value),
            lastUpdated: latestByParam.temperature?.createdAt ?? null,
          });

          const historyByTimestamp = new Map();
          paramsToWatch.forEach((currentParam) => {
            entriesByParam[currentParam].forEach((entry) => {
              const current = historyByTimestamp.get(entry.createdAt) || {};
              current[currentParam] = entry.value;
              historyByTimestamp.set(entry.createdAt, current);
            });
          });

          setHistory(
            [...historyByTimestamp.entries()]
              .map(([createdAt, values]) => {
                const sal = ecToSalinity(values.ec);
                return {
                  time: new Date(createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
                  temp: values.temperature ?? null,
                  ph: values.ph ?? null,
                  do: values.do ?? null,
                  sal,
                  status: getOverallStatus({
                    temp: values.temperature,
                    ph: values.ph,
                    do: values.do,
                    sal,
                  }),
                  createdAt,
                };
              })
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          );
          setLoading(false);
        }
      })
    );

    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  return { reading, history, loading };
}