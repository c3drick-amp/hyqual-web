import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { rtdb } from "../firebase";

export const DEVICE_SENSORS = [
  { key: "temperature", label: "Temp" },
  { key: "ph", label: "pH" },
  { key: "do", label: "DO" },
  { key: "ec", label: "EC" },
];

export function useDeviceStatus() {
  const [batteryPercent, setBatteryPercent] = useState(null);
  const [sensorStatus, setSensorStatus] = useState({});
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    const unsubscribeBattery = onValue(ref(rtdb, "battery"), (snapshot) => {
      const percent = Number(snapshot.val()?.percent);
      setBatteryPercent(Number.isFinite(percent) ? percent : null);
    });

    const unsubscribeStatus = onValue(ref(rtdb, "status"), (snapshot) => {
      const status = snapshot.val() || {};
      setSensorStatus(
        Object.fromEntries(
          DEVICE_SENSORS.map(({ key }) => [
            key,
            {
              online: status[key]?.working === true,
              lastUpdated: status[key]?.createdAt ?? null,
            },
          ])
        )
      );
    });

    const unsubscribeAssignment = onValue(ref(rtdb, "assignment"), (snapshot) => {
      const value = snapshot.val();
      if (value?.farmId != null && value?.pondId != null) {
        setAssignment({ farmId: Number(value.farmId), pondId: String(value.pondId) });
      }
    });

    return () => {
      unsubscribeBattery();
      unsubscribeStatus();
      unsubscribeAssignment();
    };
  }, []);

  const statusReady = Object.keys(sensorStatus).length === DEVICE_SENSORS.length;
  const deviceOnline = statusReady && DEVICE_SENSORS.every(({ key }) => sensorStatus[key]?.online);

  return { batteryPercent, sensorStatus, assignment, statusReady, deviceOnline };
}
