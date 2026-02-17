"use client";

import { lifecycleData } from "../_data/lifecycle-data";
import { AnimatedSection } from "../_components/AnimatedSection";
import { ChartCard } from "../_components/ChartCard";
import { FilterBar } from "../_components/FilterBar";
import { MetricCard } from "../_components/MetricCard";
import { BarChart } from "../_components/BarChart";
import { AreaChart } from "../_components/AreaChart";
import { CHART_COLORS } from "../_lib/colors";

export default function LifecyclePage() {
  const { weeks, metrics } = lifecycleData;

  // Stacked bar chart data (dormant shown as positive for display, styled differently)
  const stackedData = weeks.map((w) => ({
    week: w.week,
    New: w.new,
    Returning: w.returning,
    Resurrecting: w.resurrecting,
    Dormant: Math.abs(w.dormant),
  }));

  // Proportions area chart
  const proportionData = weeks.map((w) => {
    const positive = w.new + w.returning + w.resurrecting;
    return {
      week: w.week,
      "New %": Math.round((w.new / positive) * 100),
      "Returning %": Math.round((w.returning / positive) * 100),
      "Resurrecting %": Math.round((w.resurrecting / positive) * 100),
    };
  });

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300 mb-4 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Growth Analysis
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Lifecycle</h1>
          <p className="text-gray-400">Understand how your user base evolves week over week</p>
        </div>

        <FilterBar />

        {/* Metrics */}
        <AnimatedSection className="mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
              <div key={metric.label} style={{ transitionDelay: `${i * 100}ms` }}>
                <MetricCard
                  label={metric.label}
                  value={metric.value}
                  change={metric.change}
                  changeLabel="vs prev period"
                />
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Lifecycle stacked bar chart */}
        <AnimatedSection className="mb-6" delay={100}>
          <ChartCard
            title="User Lifecycle"
            description="Weekly breakdown: New, Returning, Resurrecting, and Dormant users"
          >
            <BarChart
              data={stackedData}
              xKey="week"
              bars={[
                { key: "New", name: "New", color: CHART_COLORS.green, stackId: "lifecycle" },
                { key: "Returning", name: "Returning", color: CHART_COLORS.primary, stackId: "lifecycle" },
                { key: "Resurrecting", name: "Resurrecting", color: CHART_COLORS.cyan, stackId: "lifecycle" },
                { key: "Dormant", name: "Dormant", color: CHART_COLORS.red, stackId: "dormant" },
              ]}
              height={340}
            />
          </ChartCard>
        </AnimatedSection>

        {/* Lifecycle legend */}
        <AnimatedSection className="mb-6" delay={150}>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { label: "New", color: CHART_COLORS.green, desc: "First-time users this week" },
              { label: "Returning", color: CHART_COLORS.primary, desc: "Active last week and this week" },
              { label: "Resurrecting", color: CHART_COLORS.cyan, desc: "Returned after being dormant" },
              { label: "Dormant", color: CHART_COLORS.red, desc: "Active last week, not this week" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 group cursor-default">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-300">{item.label}</span>
                <span className="text-xs text-gray-600 hidden group-hover:inline">— {item.desc}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />

        {/* Proportions chart */}
        <AnimatedSection delay={200}>
          <ChartCard
            title="Active User Composition"
            description="Proportion of new, returning, and resurrecting users over time"
          >
            <AreaChart
              data={proportionData}
              xKey="week"
              areas={[
                { key: "New %", name: "New", color: CHART_COLORS.green, stackId: "pct" },
                { key: "Returning %", name: "Returning", color: CHART_COLORS.primary, stackId: "pct" },
                { key: "Resurrecting %", name: "Resurrecting", color: CHART_COLORS.cyan, stackId: "pct" },
              ]}
              height={280}
            />
          </ChartCard>
        </AnimatedSection>

        {/* Bottom badge */}
        <AnimatedSection className="mt-12 mb-8" delay={300}>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
              <span className="text-primary-400 font-semibold">{weeks.length}</span>
              <span className="text-gray-300">weeks of lifecycle data analyzed</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
