import type { TrendsPageData } from "../_lib/types";

function generateDailyData(baseLine: number, variance: number, days: number, trend: number = 0) {
  const data: { date: string; value: number }[] = [];
  const start = new Date("2026-01-19");
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    // Weekday-heavy pattern: professionals use during work breaks and evenings
    // Saturday ~40% of weekday, Sunday ~30% of weekday
    const weekendDip = dayOfWeek === 0 ? 0.3 : dayOfWeek === 6 ? 0.4 : 1;
    // Slight boost on Tue/Wed/Thu (peak professional engagement)
    const midweekBoost = dayOfWeek >= 2 && dayOfWeek <= 4 ? 1.1 : 1;
    const value = Math.round(
      (baseLine + trend * i + (Math.random() - 0.5) * variance) * weekendDip * midweekBoost
    );
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.max(0, value),
    });
  }
  return data;
}

const days = 30;

export const trendsData: TrendsPageData = {
  events: ["gocard_completed", "path_started", "evidence_uploaded", "ai_tool_used", "mi_chat_opened", "milestone_completed"],
  breakdowns: ["None", "Profession", "Age Group", "Membership", "Plan", "Province"],
  series: [
    { name: "gocard_completed", data: generateDailyData(450, 80, days, 5) },
    { name: "path_started", data: generateDailyData(120, 30, days, 2) },
    { name: "evidence_uploaded", data: generateDailyData(75, 20, days, 1.5) },
    { name: "ai_tool_used", data: generateDailyData(105, 25, days, 3) },
  ],
  tableData: Array.from({ length: days }, (_, i) => {
    const d = new Date("2026-01-19");
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    const weekendDip = dayOfWeek === 0 ? 0.3 : dayOfWeek === 6 ? 0.4 : 1;
    const midweekBoost = dayOfWeek >= 2 && dayOfWeek <= 4 ? 1.1 : 1;
    const factor = weekendDip * midweekBoost;
    return {
      date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      "gocard_completed": Math.round((450 + 5 * i + (Math.random() - 0.5) * 80) * factor),
      "path_started": Math.round((120 + 2 * i + (Math.random() - 0.5) * 30) * factor),
      "evidence_uploaded": Math.round((75 + 1.5 * i + (Math.random() - 0.5) * 20) * factor),
      "ai_tool_used": Math.round((105 + 3 * i + (Math.random() - 0.5) * 25) * factor),
    };
  }),
};
