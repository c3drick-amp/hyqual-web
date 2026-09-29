function getUserScope() {
  if (typeof localStorage === "undefined") return "anonymous";

  try {
    return JSON.parse(localStorage.getItem("hyqual_user") || "null")?.uid || "anonymous";
  } catch {
    return "anonymous";
  }
}

function getStorageKey() {
  return `hyqual_seen_alerts_${getUserScope()}`;
}

export function getSeenAlertIds() {
  if (typeof localStorage === "undefined") return [];

  try {
    const ids = JSON.parse(localStorage.getItem(getStorageKey()) || "[]");
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function markAlertSeen(alertId) {
  if (typeof localStorage === "undefined") return;

  const seenIds = new Set(getSeenAlertIds());
  seenIds.add(alertId);
  localStorage.setItem(getStorageKey(), JSON.stringify([...seenIds]));
}