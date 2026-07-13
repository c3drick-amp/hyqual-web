// DUMMY DATA — replace with real API/Firebase data later.
// Keeping it in one file makes it easy to swap out.

export const farmStats = {
  registered: 24,
  active: 22,
  offline: 2,
  normal: 19,
  critical: 3,
};

export const recentWarnings = [
  {
    id: 1,
    type: "WATER QUALITY",
    status: "Critical",
    farm: "Wawa Marine Pens",
    detail: "DO dropped to 3.1 mg/L",
    action: "Activate aerators immediately.",
    time: "2m ago · Jul 6, 10:42",
  },
  {
    id: 2,
    type: "WATER QUALITY",
    status: "Critical",
    farm: "Lazareto Aqua Farm",
    detail: "pH rising past 8.4",
    action: "Reduce feeding; prepare partial water exchange.",
    time: "14m ago · Jul 6, 10:30",
  },
  {
    id: 3,
    type: "DEVICE",
    status: "Offline",
    farm: "San Antonio Tilapia",
    detail: "Monitoring device disconnected",
    action: "Check device power and connection.",
    time: "1h ago · Jul 6, 09:40",
  },
];

export const currentUser = {
  name: "Maria Reyes",
  role: "BFAR Administrator",
  initials: "MR",
};