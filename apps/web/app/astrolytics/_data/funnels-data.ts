import type { FunnelsPageData } from "../_lib/types";

export const funnelsData: FunnelsPageData = {
  steps: [
    { name: "Landing Page", count: 12847, conversionRate: 100, dropOff: 0, medianTime: "—" },
    { name: "Sign Up Started", count: 5821, conversionRate: 45.3, dropOff: 54.7, medianTime: "24s" },
    { name: "Email Verified", count: 4190, conversionRate: 72.0, dropOff: 28.0, medianTime: "3m 12s" },
    { name: "Onboarding Complete", count: 2934, conversionRate: 70.0, dropOff: 30.0, medianTime: "8m 45s" },
    { name: "First Action", count: 2180, conversionRate: 74.3, dropOff: 25.7, medianTime: "1m 30s" },
    { name: "Subscription", count: 891, conversionRate: 40.9, dropOff: 59.1, medianTime: "2d 4h" },
  ],
  conversionOverTime: [
    { week: "Jan 6", rate: 6.2 },
    { week: "Jan 13", rate: 6.5 },
    { week: "Jan 20", rate: 6.8 },
    { week: "Jan 27", rate: 6.4 },
    { week: "Feb 3", rate: 7.1 },
    { week: "Feb 10", rate: 7.3 },
    { week: "Feb 17", rate: 6.9 },
    { week: "Feb 24", rate: 7.5 },
    { week: "Mar 3", rate: 7.8 },
    { week: "Mar 10", rate: 7.2 },
    { week: "Mar 17", rate: 8.1 },
    { week: "Mar 24", rate: 7.6 },
  ],
  breakdown: [
    { property: "Google Ads", rate: 8.9 },
    { property: "Organic Search", rate: 7.4 },
    { property: "Direct", rate: 6.8 },
    { property: "Social Media", rate: 5.2 },
    { property: "Email Campaign", rate: 9.1 },
    { property: "Referral", rate: 11.3 },
  ],
};
