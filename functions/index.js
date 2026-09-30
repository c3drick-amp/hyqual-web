import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

initializeApp();

const db = getFirestore();

export const auditDeviceRegistration = onDocumentCreated("devices/{deviceId}", async (event) => {
  const device = event.data?.data();
  if (!device) return;

  const deviceId = event.params.deviceId;
  const actorId = device.registeredBy || device.ownerId || "mobile-app";
  const actor = device.registeredByName || device.ownerName || "Mobile app";
  const deviceName = device.deviceName || device.name || "Device";
  const farmDetail = device.farmId ? ` for farm ${device.farmId}` : "";

  await db.collection("auditLogs").doc(`device-registration-${deviceId}`).set({
    actorId: String(actorId),
    actor,
    actorRole: "Mobile app",
    type: "device",
    action: "registered device",
    detail: `${deviceName} (${deviceId})${farmDetail}`,
    createdAt: FieldValue.serverTimestamp(),
  });
});