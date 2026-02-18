"use client";

import { useState } from "react";
import { AnimatedSection } from "../_components/AnimatedSection";
import { DataTable } from "../_components/DataTable";
import { BarChart } from "../_components/BarChart";
import { CHART_COLORS } from "../_lib/colors";

const DEFAULT_QUERY = `SELECT
  properties.$browser AS browser,
  count() AS total_events,
  uniq(distinct_id) AS unique_users,
  round(total_events / unique_users, 1) AS events_per_user
FROM events
WHERE timestamp > now() - interval 30 day
GROUP BY browser
ORDER BY total_events DESC
LIMIT 10`;

const MOCK_RESULTS = [
  { Browser: "Chrome", "Total Events": 18420, "Unique Users": 4210, "Events/User": 4.4 },
  { Browser: "Safari", "Total Events": 8940, "Unique Users": 2180, "Events/User": 4.1 },
  { Browser: "Firefox", "Total Events": 5320, "Unique Users": 1450, "Events/User": 3.7 },
  { Browser: "Edge", "Total Events": 3180, "Unique Users": 890, "Events/User": 3.6 },
  { Browser: "Mobile Safari", "Total Events": 2840, "Unique Users": 1120, "Events/User": 2.5 },
  { Browser: "Chrome Mobile", "Total Events": 2460, "Unique Users": 980, "Events/User": 2.5 },
  { Browser: "Samsung Internet", "Total Events": 680, "Unique Users": 310, "Events/User": 2.2 },
  { Browser: "Opera", "Total Events": 420, "Unique Users": 180, "Events/User": 2.3 },
];

type ViewMode = "table" | "chart";

export default function SqlPage() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [hasRun, setHasRun] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const headers = hasRun ? Object.keys(MOCK_RESULTS[0]!) : [];
  const rows = hasRun ? MOCK_RESULTS.map((r) => Object.values(r).map((v) => typeof v === "number" ? v.toLocaleString() : v)) : [];
  const chartData = MOCK_RESULTS.map((r) => ({
    name: r.Browser,
    "Total Events": r["Total Events"],
  }));

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300 mb-4 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            NovaQL
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">SQL Explorer</h1>
          <p className="text-gray-400">Query your analytics data directly with NovaQL</p>
        </div>

        {/* Editor */}
        <AnimatedSection className="mb-6">
          <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
            <div className="relative">
              {/* Editor header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                  <div className="w-3 h-3 rounded-full bg-green-400/50" />
                  <span className="text-xs text-gray-500 ml-2">query.sql</span>
                </div>
                <button
                  onClick={() => setHasRun(true)}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-xs font-medium rounded-lg transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  Run Query
                </button>
              </div>

              {/* Textarea */}
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                spellCheck={false}
                className="w-full bg-transparent px-4 py-4 text-sm text-gray-300 font-mono leading-relaxed resize-none focus:outline-none min-h-[200px]"
                style={{ tabSize: 2 }}
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Results */}
        {hasRun && (
          <>
            {/* Results header */}
            <AnimatedSection className="mb-4" delay={100}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Results</h2>
                  <p className="text-sm text-gray-400">{MOCK_RESULTS.length} rows returned in 0.23s</p>
                </div>
                <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1 border border-gray-700">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      viewMode === "table"
                        ? "bg-primary-500/20 text-primary-400"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" />
                    </svg>
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode("chart")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      viewMode === "chart"
                        ? "bg-primary-500/20 text-primary-400"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                    Chart
                  </button>
                </div>
              </div>
            </AnimatedSection>

            {/* Results view */}
            <AnimatedSection delay={200}>
              {viewMode === "table" ? (
                <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                  <div className="relative">
                    <DataTable headers={headers} rows={rows} />
                  </div>
                </div>
              ) : (
                <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                  <div className="relative">
                    <BarChart
                      data={chartData}
                      xKey="name"
                      bars={[{ key: "Total Events", name: "Total Events", color: CHART_COLORS.primary }]}
                      layout="vertical"
                      height={320}
                    />
                  </div>
                </div>
              )}
            </AnimatedSection>
          </>
        )}

        {/* Bottom badge */}
        <AnimatedSection className="mt-12 mb-8" delay={300}>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
              <span className="text-primary-400 font-semibold">NovaQL</span>
              <span className="text-gray-300">powered by Nova&apos;s query engine</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
