import type { DashboardData } from "../_lib/types";

export const dashboardData: DashboardData = {
  metrics: [
    { label: "Total Users", value: "12,847", change: 14.2, changeLabel: "vs last month" },
    { label: "Active Users (7d)", value: "3,291", change: 8.7, changeLabel: "vs last week" },
    { label: "Events (24h)", value: "48,392", change: 5.3, changeLabel: "vs yesterday" },
    { label: "Avg Session", value: "4m 32s", change: -2.1, changeLabel: "vs last week" },
  ],

  userActivity: [
    { date: "Jan 20", dau: 1820, wau: 2940, mau: 8120 },
    { date: "Jan 21", dau: 1950, wau: 2980, mau: 8200 },
    { date: "Jan 22", dau: 2100, wau: 3050, mau: 8340 },
    { date: "Jan 23", dau: 1780, wau: 3020, mau: 8410 },
    { date: "Jan 24", dau: 1640, wau: 2890, mau: 8500 },
    { date: "Jan 25", dau: 1200, wau: 2750, mau: 8560 },
    { date: "Jan 26", dau: 1150, wau: 2700, mau: 8600 },
    { date: "Jan 27", dau: 2050, wau: 2950, mau: 8680 },
    { date: "Jan 28", dau: 2200, wau: 3100, mau: 8750 },
    { date: "Jan 29", dau: 2350, wau: 3180, mau: 8830 },
    { date: "Jan 30", dau: 2180, wau: 3150, mau: 8900 },
    { date: "Jan 31", dau: 2400, wau: 3220, mau: 8980 },
    { date: "Feb 1", dau: 1900, wau: 3100, mau: 9050 },
    { date: "Feb 2", dau: 1300, wau: 2980, mau: 9100 },
    { date: "Feb 3", dau: 2280, wau: 3150, mau: 9180 },
    { date: "Feb 4", dau: 2450, wau: 3280, mau: 9250 },
    { date: "Feb 5", dau: 2600, wau: 3350, mau: 9340 },
    { date: "Feb 6", dau: 2520, wau: 3400, mau: 9420 },
    { date: "Feb 7", dau: 2700, wau: 3450, mau: 9500 },
    { date: "Feb 8", dau: 2100, wau: 3380, mau: 9570 },
    { date: "Feb 9", dau: 1400, wau: 3200, mau: 9620 },
    { date: "Feb 10", dau: 2650, wau: 3420, mau: 9700 },
    { date: "Feb 11", dau: 2800, wau: 3500, mau: 9780 },
    { date: "Feb 12", dau: 2950, wau: 3580, mau: 9860 },
    { date: "Feb 13", dau: 2880, wau: 3620, mau: 9940 },
    { date: "Feb 14", dau: 3100, wau: 3700, mau: 10020 },
    { date: "Feb 15", dau: 2400, wau: 3650, mau: 10100 },
    { date: "Feb 16", dau: 1600, wau: 3500, mau: 10150 },
    { date: "Feb 17", dau: 3050, wau: 3680, mau: 10230 },
    { date: "Feb 18", dau: 3200, wau: 3750, mau: 10310 },
  ],

  topEvents: [
    { name: "Pageview", count: 18420, change: 12.3 },
    { name: "Button Click", count: 8930, change: 5.7 },
    { name: "Form Submit", count: 4210, change: -1.2 },
    { name: "Sign Up", count: 3850, change: 22.4 },
    { name: "Feature Used", count: 3240, change: 8.9 },
    { name: "Search", count: 2870, change: 3.1 },
    { name: "File Upload", count: 1950, change: 15.6 },
    { name: "Share Link", count: 1620, change: -4.8 },
    { name: "Download", count: 1380, change: 7.2 },
    { name: "Error", count: 920, change: -18.3 },
  ],

  weeklyActiveUsers: [
    { week: "W48", users: 2180 },
    { week: "W49", users: 2340 },
    { week: "W50", users: 2520 },
    { week: "W51", users: 2280 },
    { week: "W52", users: 1900 },
    { week: "W1", users: 2650 },
    { week: "W2", users: 2890 },
    { week: "W3", users: 3050 },
    { week: "W4", users: 2940 },
    { week: "W5", users: 3180 },
    { week: "W6", users: 3350 },
    { week: "W7", users: 3520 },
  ],

  recentFlags: [
    { name: "New Checkout Flow", status: "active", rollout: 25 },
    { name: "Dark Mode V2", status: "active", rollout: 100 },
    { name: "AI Suggestions", status: "paused", rollout: 10 },
  ],

  activeExperiments: [
    { name: "Pricing Page CTA", variant: "Test A", improvement: 19.5 },
    { name: "Onboarding Flow", variant: "Test B", improvement: 12.3 },
  ],

  insights: [
    {
      text: "User retention improved 12% after the onboarding flow changes deployed in Week 5. Users who complete onboarding within 24 hours have 3x higher 30-day retention.",
      type: "positive",
    },
    {
      text: "Sign-up conversion from the pricing page is up 22.4% this month. The new CTA experiment (Test A) is showing strong statistical significance at 95.2%.",
      type: "positive",
    },
    {
      text: "Error events decreased 18.3% — the bug fix in the file upload module is having a measurable impact. Monitor for regression in the next release.",
      type: "neutral",
    },
  ],
};
