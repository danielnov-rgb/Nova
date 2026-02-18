"use client";

import { retentionData } from "../_data/retention-data";
import { AnimatedSection } from "../_components/AnimatedSection";
import { ChartCard } from "../_components/ChartCard";
import { FilterBar } from "../_components/FilterBar";
import { MetricCard } from "../_components/MetricCard";
import { LineChart } from "../_components/LineChart";
import { RetentionGrid } from "../_components/RetentionGrid";
import { CHART_COLORS } from "../_lib/colors";

export default function RetentionPage() {
  const { cohorts, retentionCurve, summaryMetrics } = retentionData;

  const curveChartData = retentionCurve.map((d) => ({
    day: `Day ${d.day}`,
    "Retention %": d.rate,
  }));

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Cohort Analysis
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Retention</h1>
          <p className="text-gray-400">How well you retain users over time</p>
        </div>

        <FilterBar />

        {/* Summary metrics */}
        <AnimatedSection className="mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryMetrics.map((metric, i) => (
              <div key={metric.label} style={{ transitionDelay: `${i * 100}ms` }}>
                <MetricCard label={metric.label} value={metric.value} />
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Retention heatmap */}
        <AnimatedSection className="mb-6" delay={100}>
          <ChartCard title="Cohort Retention" description="Weekly cohorts — percentage returning each week">
            <RetentionGrid cohorts={cohorts} />
          </ChartCard>
        </AnimatedSection>

        {/* Retention curve */}
        <AnimatedSection className="mb-6" delay={200}>
          <ChartCard title="Retention Curve" description="Average retention rate across all cohorts">
            <LineChart
              data={curveChartData}
              xKey="day"
              lines={[{ key: "Retention %", name: "Retention", color: CHART_COLORS.primary }]}
              height={280}
            />
          </ChartCard>
        </AnimatedSection>

        {/* Bottom badge */}
        <AnimatedSection className="mt-12 mb-8" delay={300}>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
              <span className="text-primary-400 font-semibold">{cohorts.length}</span>
              <span className="text-gray-300">cohorts analyzed over {cohorts[0]!.retention.length} weeks</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
