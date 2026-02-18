import type { RetentionPageData } from "../_lib/types";

export const retentionData: RetentionPageData = {
  cohorts: [
    { period: "Jan 6", totalUsers: 1850, retention: [100, 62, 48, 42, 36, 32, 28, 24] },
    { period: "Jan 13", totalUsers: 1920, retention: [100, 64, 50, 44, 38, 33, 29, 25] },
    { period: "Jan 20", totalUsers: 2050, retention: [100, 61, 47, 41, 35, 30, 26, 0] },
    { period: "Jan 27", totalUsers: 1980, retention: [100, 60, 46, 40, 34, 29, 0, 0] },
    { period: "Feb 3", totalUsers: 2200, retention: [100, 65, 51, 45, 38, 0, 0, 0] },
    { period: "Feb 10", totalUsers: 2150, retention: [100, 63, 49, 43, 0, 0, 0, 0] },
    { period: "Feb 17", totalUsers: 2080, retention: [100, 62, 48, 0, 0, 0, 0, 0] },
    { period: "Feb 24", totalUsers: 2300, retention: [100, 64, 0, 0, 0, 0, 0, 0] },
    { period: "Mar 3", totalUsers: 2420, retention: [100, 0, 0, 0, 0, 0, 0, 0] },
  ],
  retentionCurve: [
    { day: 0, rate: 100 },
    { day: 1, rate: 62.0 },
    { day: 2, rate: 48.0 },
    { day: 3, rate: 42.0 },
    { day: 4, rate: 37.5 },
    { day: 5, rate: 33.8 },
    { day: 6, rate: 30.5 },
    { day: 7, rate: 35.0 },
    { day: 14, rate: 28.0 },
    { day: 21, rate: 24.8 },
    { day: 30, rate: 22.0 },
  ],
  summaryMetrics: [
    { label: "Day 1 Retention", value: "62%" },
    { label: "Week 1 Retention", value: "35%" },
    { label: "Day 14 Retention", value: "28%" },
    { label: "Day 30 Retention", value: "22%" },
  ],
};
