import type { DashboardData } from "../_lib/types";

export const dashboardData: DashboardData = {
  metrics: [
    { label: "Monthly Active Users", value: "18,500", change: 22.8, changeLabel: "vs last month" },
    { label: "Weekly Active Users", value: "8,400", change: 15.3, changeLabel: "vs last week" },
    { label: "Daily Active Users", value: "2,800", change: 9.1, changeLabel: "vs yesterday" },
    { label: "Avg Session", value: "6m 15s", change: 4.7, changeLabel: "vs last week" },
  ],

  userActivity: [
    { date: "Nov 24", dau: 1450, wau: 5000, mau: 12800 },
    { date: "Nov 25", dau: 1520, wau: 5100, mau: 12950 },
    { date: "Nov 26", dau: 1580, wau: 5180, mau: 13100 },
    { date: "Nov 27", dau: 1490, wau: 5150, mau: 13200 },
    { date: "Nov 28", dau: 1350, wau: 5080, mau: 13300 },
    { date: "Nov 29", dau: 980, wau: 4950, mau: 13380 },
    { date: "Nov 30", dau: 920, wau: 4880, mau: 13420 },
    { date: "Dec 1", dau: 1620, wau: 5250, mau: 13600 },
    { date: "Dec 2", dau: 1710, wau: 5380, mau: 13780 },
    { date: "Dec 3", dau: 1780, wau: 5500, mau: 13950 },
    { date: "Dec 4", dau: 1690, wau: 5480, mau: 14100 },
    { date: "Dec 5", dau: 1550, wau: 5400, mau: 14250 },
    { date: "Dec 6", dau: 1050, wau: 5280, mau: 14350 },
    { date: "Dec 7", dau: 1000, wau: 5200, mau: 14420 },
    { date: "Dec 8", dau: 1850, wau: 5600, mau: 14600 },
    { date: "Dec 9", dau: 1950, wau: 5750, mau: 14800 },
    { date: "Dec 10", dau: 2050, wau: 5900, mau: 15000 },
    { date: "Dec 11", dau: 1980, wau: 5950, mau: 15200 },
    { date: "Dec 12", dau: 1820, wau: 5880, mau: 15400 },
    { date: "Dec 13", dau: 1200, wau: 5700, mau: 15520 },
    { date: "Dec 14", dau: 1150, wau: 5620, mau: 15600 },
    { date: "Dec 15", dau: 2100, wau: 6100, mau: 15850 },
    { date: "Dec 16", dau: 2250, wau: 6350, mau: 16100 },
    { date: "Dec 17", dau: 2380, wau: 6500, mau: 16350 },
    { date: "Dec 18", dau: 1400, wau: 6200, mau: 16500 },
    { date: "Jan 6", dau: 2200, wau: 7200, mau: 17000 },
    { date: "Jan 7", dau: 2350, wau: 7400, mau: 17200 },
    { date: "Jan 8", dau: 2500, wau: 7600, mau: 17500 },
    { date: "Jan 9", dau: 2650, wau: 7850, mau: 17800 },
    { date: "Jan 10", dau: 2480, wau: 7900, mau: 18000 },
    { date: "Jan 11", dau: 1600, wau: 7700, mau: 18150 },
    { date: "Jan 12", dau: 1500, wau: 7600, mau: 18250 },
    { date: "Jan 13", dau: 2700, wau: 8100, mau: 18350 },
    { date: "Jan 14", dau: 2750, wau: 8200, mau: 18400 },
    { date: "Jan 15", dau: 2800, wau: 8300, mau: 18450 },
    { date: "Jan 16", dau: 2780, wau: 8350, mau: 18480 },
    { date: "Jan 17", dau: 2600, wau: 8400, mau: 18500 },
  ],

  topEvents: [
    { name: "Go-Card Completed", count: 12450, change: 12.0 },
    { name: "MI Chat Opened", count: 4300, change: 18.2 },
    { name: "Path Started", count: 3200, change: 9.4 },
    { name: "Evidence Uploaded", count: 2100, change: 15.6 },
    { name: "CV Builder Used", count: 1850, change: 24.1 },
    { name: "Milestone Completed", count: 1420, change: 7.8 },
    { name: "MyDNA Updated", count: 980, change: 11.3 },
    { name: "AI Tool Used", count: 2850, change: 14.5 },
    { name: "Portfolio Viewed", count: 760, change: 6.2 },
    { name: "Path Bookmarked", count: 540, change: 3.9 },
  ],

  weeklyActiveUsers: [
    { week: "W44", users: 5000 },
    { week: "W45", users: 5250 },
    { week: "W46", users: 5500 },
    { week: "W47", users: 5800 },
    { week: "W48", users: 6100 },
    { week: "W49", users: 6400 },
    { week: "W50", users: 6800 },
    { week: "W51", users: 6200 },
    { week: "W1", users: 7200 },
    { week: "W2", users: 7800 },
    { week: "W3", users: 8100 },
    { week: "W4", users: 8400 },
  ],

  recentFlags: [
    { name: "AI CV Builder V2", status: "active", rollout: 50 },
    { name: "MI Career Coach", status: "active", rollout: 100 },
    { name: "Evidence Auto-Tag", status: "paused", rollout: 15 },
  ],

  activeExperiments: [
    { name: "Go-Card Difficulty Levels", variant: "Adaptive", improvement: 16.2 },
    { name: "Path Recommendation Engine", variant: "ML-based", improvement: 11.8 },
  ],

  insights: [
    {
      text: "Go-Card completion rate up 12% this week, driven by the new adaptive difficulty feature. Users completing 3+ Go-Cards per session increased by 28% compared to the previous week.",
      type: "positive",
    },
    {
      text: "CV Builder is the #1 AI tool by usage with 1,850 sessions this month, up 24.1%. Professionals aged 35-45 account for 42% of CV Builder usage, suggesting strong mid-career adoption.",
      type: "positive",
    },
    {
      text: "55+ age group showing 3x expected engagement — this cohort completes an average of 4.2 Go-Cards per week versus the 1.4 predicted. Consider expanding content targeting senior professionals.",
      type: "neutral",
    },
  ],
};
