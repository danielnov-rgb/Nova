"use client";

import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SERIES_COLORS, RECHARTS_THEME, RECHARTS_THEME_LIGHT } from "../_lib/colors";
import { useTheme } from "./ThemeProvider";

interface BarChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  bars: { key: string; name: string; color?: string; stackId?: string }[];
  height?: number;
  layout?: "horizontal" | "vertical";
}

export function BarChart({ data, xKey, bars, height = 300, layout = "horizontal" }: BarChartProps) {
  const { theme } = useTheme();
  const t = theme === "light" ? RECHARTS_THEME_LIGHT : RECHARTS_THEME;
  const tooltipTextColor = theme === "light" ? "#0f172a" : "#fff";
  const isVertical = layout === "vertical";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} layout={isVertical ? "vertical" : "horizontal"}>
        <CartesianGrid strokeDasharray="3 3" stroke={t.cartesianGridStroke} />
        {isVertical ? (
          <>
            <XAxis type="number" tick={{ fill: t.axisTickFill, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey={xKey} tick={{ fill: t.axisTickFill, fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tick={{ fill: t.axisTickFill, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: t.axisTickFill, fontSize: 12 }} axisLine={false} tickLine={false} />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: t.tooltipBg,
            border: `1px solid ${t.tooltipBorder}`,
            borderRadius: "8px",
            color: tooltipTextColor,
            fontSize: 13,
          }}
        />
        {bars.length > 1 && (
          <Legend wrapperStyle={{ color: t.legendColor, fontSize: 13 }} />
        )}
        {bars.map((bar, i) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color ?? SERIES_COLORS[i % SERIES_COLORS.length]}
            stackId={bar.stackId}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
