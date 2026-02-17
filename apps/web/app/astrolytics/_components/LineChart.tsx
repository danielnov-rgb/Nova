"use client";

import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SERIES_COLORS, RECHARTS_THEME, RECHARTS_THEME_LIGHT } from "../_lib/colors";
import { useTheme } from "./ThemeProvider";

interface LineChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  lines: { key: string; name: string; color?: string }[];
  height?: number;
}

export function LineChart({ data, xKey, lines, height = 300 }: LineChartProps) {
  const { theme } = useTheme();
  const t = theme === "light" ? RECHARTS_THEME_LIGHT : RECHARTS_THEME;
  const tooltipTextColor = theme === "light" ? "#0f172a" : "#fff";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={t.cartesianGridStroke} />
        <XAxis dataKey={xKey} tick={{ fill: t.axisTickFill, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: t.axisTickFill, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: t.tooltipBg,
            border: `1px solid ${t.tooltipBorder}`,
            borderRadius: "8px",
            color: tooltipTextColor,
            fontSize: 13,
          }}
        />
        {lines.length > 1 && (
          <Legend wrapperStyle={{ color: t.legendColor, fontSize: 13 }} />
        )}
        {lines.map((line, i) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={line.color ?? SERIES_COLORS[i % SERIES_COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: line.color ?? SERIES_COLORS[i % SERIES_COLORS.length] }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
