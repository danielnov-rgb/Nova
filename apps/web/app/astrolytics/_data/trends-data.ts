import type { TrendsPageData } from "../_lib/types";

function generateDailyData(baseLine: number, variance: number, days: number, trend: number = 0) {
  const data: { date: string; value: number }[] = [];
  const start = new Date("2026-01-19");
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;
    const value = Math.round(
      (baseLine + trend * i + (Math.random() - 0.5) * variance) * weekendDip
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
  events: ["Page View", "Sign Up", "Button Click", "Purchase", "Search", "File Upload"],
  breakdowns: ["None", "Browser", "Country", "Device", "OS", "Referrer"],
  series: [
    { name: "Page View", data: generateDailyData(4200, 800, days, 15) },
    { name: "Sign Up", data: generateDailyData(320, 80, days, 3) },
    { name: "Button Click", data: generateDailyData(1850, 400, days, 8) },
    { name: "Purchase", data: generateDailyData(140, 35, days, 2) },
  ],
  tableData: Array.from({ length: days }, (_, i) => {
    const d = new Date("2026-01-19");
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;
    return {
      date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      "Page View": Math.round((4200 + 15 * i + (Math.random() - 0.5) * 800) * weekendDip),
      "Sign Up": Math.round((320 + 3 * i + (Math.random() - 0.5) * 80) * weekendDip),
      "Button Click": Math.round((1850 + 8 * i + (Math.random() - 0.5) * 400) * weekendDip),
      "Purchase": Math.round((140 + 2 * i + (Math.random() - 0.5) * 35) * weekendDip),
    };
  }),
};
