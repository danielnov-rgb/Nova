import type { FunnelsPageData } from "../_lib/types";

export const funnelsData: FunnelsPageData = {
  steps: [
    { name: "App Open", count: 18500, conversionRate: 100, dropOff: 0, medianTime: "—" },
    { name: "Browse Paths", count: 12400, conversionRate: 67.0, dropOff: 33.0, medianTime: "18s" },
    { name: "Start Go-Card", count: 8200, conversionRate: 66.1, dropOff: 33.9, medianTime: "2m 45s" },
    { name: "Complete Go-Card", count: 5100, conversionRate: 62.2, dropOff: 37.8, medianTime: "4m 30s" },
    { name: "Use AI Tool", count: 2850, conversionRate: 55.9, dropOff: 44.1, medianTime: "1m 20s" },
    { name: "Upload Evidence", count: 1200, conversionRate: 42.1, dropOff: 57.9, medianTime: "3m 10s" },
  ],
  conversionOverTime: [
    { week: "Nov 11", rate: 3.5 },
    { week: "Nov 18", rate: 3.8 },
    { week: "Nov 25", rate: 3.9 },
    { week: "Dec 2", rate: 4.2 },
    { week: "Dec 9", rate: 4.5 },
    { week: "Dec 16", rate: 4.4 },
    { week: "Dec 23", rate: 3.8 },
    { week: "Dec 30", rate: 4.1 },
    { week: "Jan 6", rate: 5.0 },
    { week: "Jan 13", rate: 5.5 },
    { week: "Jan 20", rate: 5.9 },
    { week: "Jan 27", rate: 6.2 },
  ],
  breakdown: [
    { property: "Doctors", rate: 7.8 },
    { property: "Lawyers", rate: 6.4 },
    { property: "Accountants (CA)", rate: 8.2 },
    { property: "Engineers", rate: 5.9 },
    { property: "Core Members", rate: 9.1 },
    { property: "New Users", rate: 3.4 },
  ],
};
