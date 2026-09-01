// Since there's currently only ONE physical HyQual prototype device, we point it
// at a single farm/pond for now, for demo purposes. Once multiple devices exist
// (per your document's Device-to-Pond Assignment feature), this hardcoded mapping
// gets replaced by a real lookup, a device's assignment stored in Firestore.
export const LIVE_DEVICE_TARGET = {
  farmId: 3, // Sta. Isabel Hatchery
  pondId: "A",
};