// DUMMY DATA — replace with real API/Firebase data later.
// Keeping it in one file makes it easy to swap out.

export const farmStats = {
  registered: 8,
  active: 6,
  offline: 2,
  normal: 3,
  critical: 2,
  moderate: 1,
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

export const farmLocations = [
  { id: 1, name: "Bayanan Pond Cluster", status: "normal", top: "62%", left: "28%" },
  { id: 2, name: "Wawa Marine Pens", status: "critical", top: "40%", left: "70%" },
  { id: 3, name: "Lazareto Aqua Farm", status: "moderate", top: "20%", left: "45%" },
];

export const recentActivity = [
  {
    id: 1,
    farm: "Bayanan Pond Cluster",
    action: "New water quality reading uploaded",
    time: "just now · Jul 6, 10:44",
  },
  {
    id: 2,
    farm: "Wawa Marine Pens",
    action: "Critical hybrid warning generated",
    time: "2m ago · Jul 6, 10:42",
  },
  {
    id: 3,
    farm: "Lazareto Aqua Farm",
    action: "Alert acknowledged by BFAR personnel",
    time: "10m ago · Jul 6, 10:34",
  },
  {
    id: 4,
    farm: "Sta. Isabel Hatchery",
    action: "Weekly monitoring report generated",
    time: "1h ago · Jul 6, 09:40",
  },
  {
    id: 5,
    farm: "Calero Bay Pens",
    action: "Sensor node reconnected",
    time: "2h ago · Jul 6, 08:35",
  },
];