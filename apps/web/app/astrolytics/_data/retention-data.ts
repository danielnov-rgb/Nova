import type { RetentionPageData } from "../_lib/types";

export const retentionData: RetentionPageData = {
  cohorts: [
    { period: "Jan 6", totalUsers: 1240, retention: [100, 62, 48, 41, 36, 32, 29, 27] },
    { period: "Jan 13", totalUsers: 1185, retention: [100, 64, 50, 43, 38, 34, 31, 28] },
    { period: "Jan 20", totalUsers: 1320, retention: [100, 60, 46, 39, 34, 30, 27, 0] },
    { period: "Jan 27", totalUsers: 1150, retention: [100, 58, 44, 37, 32, 28, 0, 0] },
    { period: "Feb 3", totalUsers: 1410, retention: [100, 66, 52, 45, 40, 0, 0, 0] },
    { period: "Feb 10", totalUsers: 1380, retention: [100, 63, 49, 42, 0, 0, 0, 0] },
    { period: "Feb 17", totalUsers: 1290, retention: [100, 61, 47, 0, 0, 0, 0, 0] },
    { period: "Feb 24", totalUsers: 1450, retention: [100, 65, 0, 0, 0, 0, 0, 0] },
    { period: "Mar 3", totalUsers: 1520, retention: [100, 0, 0, 0, 0, 0, 0, 0] },
  ],
  retentionCurve: [
    { day: 0, rate: 100 },
    { day: 1, rate: 62.4 },
    { day: 2, rate: 48.0 },
    { day: 3, rate: 41.2 },
    { day: 4, rate: 36.0 },
    { day: 5, rate: 31.8 },
    { day: 6, rate: 29.0 },
    { day: 7, rate: 27.5 },
    { day: 14, rate: 22.1 },
    { day: 21, rate: 19.4 },
    { day: 30, rate: 17.2 },
  ],
  summaryMetrics: [
    { label: "Day 1 Retention", value: "62.4%" },
    { label: "Week 1 Retention", value: "27.5%" },
    { label: "Day 14 Retention", value: "22.1%" },
    { label: "Day 30 Retention", value: "17.2%" },
  ],
};
