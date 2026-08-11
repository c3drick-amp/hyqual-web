// DUMMY DATA — replace with real aggregated readings once available.
export const trendData = [
  { month: "Jan", normal: 68, critical: 18, warning: 10 },
  { month: "Feb", normal: 70, critical: 17, warning: 9 },
  { month: "Mar", normal: 74, critical: 16, warning: 8 },
  { month: "Apr", normal: 76, critical: 18, warning: 9 },
  { month: "May", normal: 78, critical: 19, warning: 10 },
  { month: "Jun", normal: 80, critical: 20, warning: 11 },
  { month: "Jul", normal: 84, critical: 24, warning: 13 },
  { month: "Aug", normal: 88, critical: 28, warning: 15 },
  { month: "Sep", normal: 82, critical: 24, warning: 13 },
  { month: "Oct", normal: 78, critical: 20, warning: 11 },
  { month: "Nov", normal: 75, critical: 18, warning: 10 },
  { month: "Dec", normal: 79, critical: 19, warning: 10 },
];

export const statusDistribution = [
  { label: "Normal", percent: 71, color: "#1f9d6e" },
  { label: "Critical", percent: 21, color: "#dc2626" },
  { label: "Warning", percent: 6, color: "#f59e0b" },
  { label: "Offline", percent: 2, color: "#9ca3af" },
];

export const summaryReports = [
  { id: 1, title: "Weekly water quality risk summary", date: "Jun 14, 2026", size: "1.2 MB", defaultFormat: "PDF" },
  { id: 2, title: "Weekly water quality risk summary", date: "Jun 10, 2026", size: "3.4 MB", defaultFormat: "CSV" },
  { id: 3, title: "Daily water quality risk summary", date: "Jun 01, 2026", size: "880 KB", defaultFormat: "PDF" },
  { id: 4, title: "Daily water quality risk summary", date: "May 28, 2026", size: "412 KB", defaultFormat: "XLSX" },
];

export const availableFormats = ["PDF", "CSV", "XLSX"];