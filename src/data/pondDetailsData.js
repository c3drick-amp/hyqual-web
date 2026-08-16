// DUMMY DATA — replace with real IoT history, generated reports, and alert logs later.
// This is shared placeholder data shown for any pond clicked into, for demo purposes.

export const historyLogs = [
  { time: "12:00 AM", temp: 27.5, do: 5.7, ph: 7.2, sal: 12.1, status: "normal" },
  { time: "12:05 AM", temp: 27.4, do: 5.5, ph: 7.3, sal: 12.1, status: "normal" },
  { time: "12:10 AM", temp: 27.6, do: 5.6, ph: 7.1, sal: 12.1, status: "normal" },
  { time: "12:15 AM", temp: 27.5, do: 5.7, ph: 7.2, sal: 12.1, status: "normal" },
  { time: "12:20 AM", temp: 27.5, do: 5.7, ph: 7.2, sal: 12.1, status: "normal" },
  { time: "12:25 AM", temp: 27.5, do: 5.7, ph: 7.2, sal: 12.1, status: "normal" },
  { time: "12:30 AM", temp: 27.5, do: 5.7, ph: 7.2, sal: 12.1, status: "normal" },
  { time: "12:35 AM", temp: 27.5, do: 5.7, ph: 7.2, sal: 12.1, status: "normal" },
  { time: "12:40 AM", temp: 27.5, do: 5.7, ph: 7.2, sal: 12.1, status: "normal" },
  { time: "12:45 AM", temp: 27.5, do: 5.7, ph: 7.2, sal: 12.1, status: "normal" },
  { time: "12:50 AM", temp: 27.5, do: 5.7, ph: 7.2, sal: 12.1, status: "normal" },
  { time: "12:55 AM", temp: 27.5, do: 5.7, ph: 7.2, sal: 12.1, status: "normal" },
];

export const pondReports = [
  { id: 1, title: "Weekly Summary Pond A", range: "June 2 – June 8, 2026" },
  { id: 2, title: "Monthly Summary", range: "January 2026" },
  { id: 3, title: "Daily Summary", range: "June 2, 2026" },
];

export const pondAlerts = [
  {
    id: 1,
    title: "High Risk - Low Dissolve Oxygen",
    pond: "Pond A",
    status: "critical",
    message: "DO level at 2.8 mg/L, above the safe threshold of ≥ 5 mg/L",
    trend: "Deteriorating Trend",
    time: "07/16/2026, 8:12 AM",
  },
  {
    id: 2,
    title: "Moderate High pH",
    pond: "Pond A",
    status: "moderate",
    message: "pH trending toward 6.5, nearing the unsafe threshold of ≥ 7.0.",
    trend: "Deteriorating Trend",
    time: "07/16/2026, 8:12 AM",
  },
  {
    id: 3,
    title: "Device Offline",
    pond: "Pond B",
    status: "offline",
    message: "No data received from sensor. Check power and connectivity.",
    trend: null,
    time: "07/16/2026, 8:12 AM",
  },
];