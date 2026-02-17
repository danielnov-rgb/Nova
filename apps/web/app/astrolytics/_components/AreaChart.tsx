"use client";

import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SERIES_COLORS, RECHARTS_THEME, RECHARTS_THEME_LIGHT } from "../_lib/colors";
import { useTheme } from "./ThemeProvider";

interface AreaChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  areas: { key: string; name: string; color?: string; stackId?: string }[];
  height?: number;
}

export function AreaChart({ data, xKey, areas, height = 300 }: AreaChartProps) {
  const { theme } = useTheme();
  const t = theme === "light" ? RECHARTS_THEME_LIGHT : RECHARTS_THEME;
  const tooltipTextColor = theme === "light" ? "#0f172a" : "#fff";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data}>
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
        {areas.length > 1 && (
          <Legend wrapperStyle={{ color: t.legendColor, fontSize: 13 }} />
        )}
        {areas.map((area, i) => {
          const color = area.color ?? SERIES_COLORS[i % SERIES_COLORS.length];
          return (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              name={area.name}
              stroke={color}
              fill={color}
              fillOpacity={0.15}
              strokeWidth={2}
              stackId={area.stackId}
            />
          );
        })}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
