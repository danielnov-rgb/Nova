"use client";

import { useState, useMemo } from "react";
import { trendsData } from "../_data/trends-data";
import { AnimatedSection } from "../_components/AnimatedSection";
import { ChartCard } from "../_components/ChartCard";
import { FilterBar } from "../_components/FilterBar";
import { DataTable } from "../_components/DataTable";
import { LineChart } from "../_components/LineChart";
import { BarChart } from "../_components/BarChart";
import { AreaChart } from "../_components/AreaChart";
import { SERIES_COLORS } from "../_lib/colors";
import { formatNumber } from "../_lib/formatters";

type ChartType = "line" | "bar" | "area";

const chartTypeIcons: Record<ChartType, React.ReactNode> = {
  line: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22" />
    </svg>
  ),
  bar: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  area: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22M21 3v5.25m0 0h-5.25M21 8.25l-7.5 7.5" />
    </svg>
  ),
};

export default function TrendsPage() {
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["Page View", "Sign Up"]);
  const [breakdown, setBreakdown] = useState("None");
  const [chartType, setChartType] = useState<ChartType>("line");

  // Transform series data into the format the chart components expect
  const chartData = useMemo(() => {
    const activeSeries = trendsData.series.filter((s) => selectedEvents.includes(s.name));
    if (activeSeries.length === 0) return [];

    return activeSeries[0].data.map((point, i) => {
      const row: Record<string, string | number> = { date: point.date };
      for (const series of activeSeries) {
        row[series.name] = series.data[i].value;
      }
      return row;
    });
  }, [selectedEvents]);

  const seriesConfig = trendsData.series
    .filter((s) => selectedEvents.includes(s.name))
    .map((s, i) => ({
      key: s.name,
      name: s.name,
      color: SERIES_COLORS[i % SERIES_COLORS.length],
    }));

  // Summary metrics
  const summaryMetrics = useMemo(() => {
    return trendsData.series
      .filter((s) => selectedEvents.includes(s.name))
      .map((s) => {
        const total = s.data.reduce((sum, d) => sum + d.value, 0);
        const avg = Math.round(total / s.data.length);
        const lastWeek = s.data.slice(-7).reduce((sum, d) => sum + d.value, 0);
        const prevWeek = s.data.slice(-14, -7).reduce((sum, d) => sum + d.value, 0);
        const change = prevWeek > 0 ? ((lastWeek - prevWeek) / prevWeek) * 100 : 0;
        return { name: s.name, total, avg, change };
      });
  }, [selectedEvents]);

  // Table data
  const tableHeaders = ["Date", ...selectedEvents];
  const tableRows = trendsData.tableData.map((row) => [
    row.date,
    ...selectedEvents.map((e) => formatNumber(row[e] as number)),
  ]);

  function toggleEvent(event: string) {
    setSelectedEvents((prev) =>
      prev.includes(event)
        ? prev.length > 1
          ? prev.filter((e) => e !== event)
          : prev
        : [...prev, event]
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background gradient orbs */}
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300 mb-4 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22" />
            </svg>
            Event Analytics
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Trends</h1>
          <p className="text-gray-400">Track how events trend over time</p>
        </div>

        {/* Filters */}
        <FilterBar>
          {/* Event selector chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {trendsData.events.map((event) => {
              const isSelected = selectedEvents.includes(event);
              return (
                <button
                  key={event}
                  onClick={() => toggleEvent(event)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  {event}
                </button>
              );
            })}
          </div>
        </FilterBar>

        {/* Secondary controls row */}
        <AnimatedSection className="mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Breakdown selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Breakdown:</span>
              <select
                value={breakdown}
                onChange={(e) => setBreakdown(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-primary-500/50"
              >
                {trendsData.breakdowns.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Chart type toggle */}
            <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1 border border-gray-700">
              {(["line", "bar", "area"] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    chartType === type
                      ? "bg-primary-500/20 text-primary-400"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {chartTypeIcons[type]}
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Summary metrics */}
        <AnimatedSection className="mb-6" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryMetrics.map((m, i) => (
              <div
                key={m.name}
                className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length] }}
                    />
                    <span className="text-xs font-medium text-gray-400">{m.name}</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{formatNumber(m.total)}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">{formatNumber(m.avg)}/day avg</span>
                    <span className={m.change >= 0 ? "text-green-400" : "text-red-400"}>
                      {m.change >= 0 ? "+" : ""}
                      {m.change.toFixed(1)}% WoW
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Main chart */}
        <AnimatedSection className="mb-6" delay={200}>
          <ChartCard
            title="Event Trends"
            description={`${selectedEvents.join(", ")} — Last 30 days${breakdown !== "None" ? ` by ${breakdown}` : ""}`}
          >
            {chartType === "line" && (
              <LineChart data={chartData} xKey="date" lines={seriesConfig} height={360} />
            )}
            {chartType === "bar" && (
              <BarChart data={chartData} xKey="date" bars={seriesConfig} height={360} />
            )}
            {chartType === "area" && (
              <AreaChart data={chartData} xKey="date" areas={seriesConfig} height={360} />
            )}
          </ChartCard>
        </AnimatedSection>

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />

        {/* Data table */}
        <AnimatedSection delay={300}>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">Raw Data</h2>
            <p className="text-sm text-gray-400">Daily event counts for selected events</p>
          </div>
          <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
            <div className="relative">
              <DataTable headers={tableHeaders} rows={tableRows} />
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom badge */}
        <AnimatedSection className="mt-12 mb-8" delay={400}>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
              <span className="text-primary-400 font-semibold">{selectedEvents.length}</span>
              <span className="text-gray-300">events tracked across {trendsData.series[0].data.length} days</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
