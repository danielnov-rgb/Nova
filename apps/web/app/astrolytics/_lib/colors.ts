// Astrolytics chart colors — Nova primary (sky-blue) + cyan system
export const CHART_COLORS = {
  primary: "#0ea5e9",    // primary-500 — Nova brand
  cyan: "#22d3ee",       // cyan-400
  blue: "#38bdf8",       // primary-400
  green: "#4ade80",
  red: "#f87171",
  amber: "#fbbf24",
  pink: "#f472b6",
  indigo: "#818cf8",
} as const;

export const SERIES_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.cyan,
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.amber,
  CHART_COLORS.pink,
  CHART_COLORS.indigo,
  CHART_COLORS.red,
];

export const STATUS_COLORS = {
  active: "#4ade80",
  paused: "#fbbf24",
  draft: "#6b7280",
  positive: "#4ade80",
  negative: "#f87171",
  neutral: "#0ea5e9",
  warning: "#fbbf24",
} as const;

export const RECHARTS_THEME = {
  axisTickFill: "#6b7280",
  gridStroke: "#1f2937",
  tooltipBg: "#111827",
  tooltipBorder: "#1f2937",
  legendColor: "#9ca3af",
  cartesianGridStroke: "rgba(31, 41, 55, 0.5)",
} as const;

export const RECHARTS_THEME_LIGHT = {
  axisTickFill: "#64748b",
  gridStroke: "#e2e8f0",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e2e8f0",
  legendColor: "#475569",
  cartesianGridStroke: "rgba(226, 232, 240, 0.7)",
} as const;
