"use client";

import { funnelsData } from "../_data/funnels-data";
import { AnimatedSection } from "../_components/AnimatedSection";
import { ChartCard } from "../_components/ChartCard";
import { FilterBar } from "../_components/FilterBar";
import { DataTable } from "../_components/DataTable";
import { LineChart } from "../_components/LineChart";
import { BarChart } from "../_components/BarChart";
import { FunnelChart } from "../_components/FunnelChart";
import { CHART_COLORS } from "../_lib/colors";
import { formatNumber } from "../_lib/formatters";

export default function FunnelsPage() {
  const { steps, conversionOverTime, breakdown } = funnelsData;
  const overallRate = ((steps[steps.length - 1]!.count / steps[0]!.count) * 100).toFixed(1);

  const tableHeaders = ["Step", "Users", "Conversion", "Drop-off", "Median Time"];
  const tableRows = steps.map((step, i) => [
    step.name,
    formatNumber(step.count),
    i === 0 ? "—" : `${step.conversionRate.toFixed(1)}%`,
    i === 0 ? "—" : `${step.dropOff.toFixed(1)}%`,
    step.medianTime,
  ]);

  const conversionChartData = conversionOverTime.map((d) => ({
    week: d.week,
    "Conversion Rate": d.rate,
  }));

  const breakdownChartData = breakdown.map((d) => ({
    name: d.property,
    "Conversion Rate": d.rate,
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            Conversion Analysis
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Funnels</h1>
          <p className="text-gray-400">Measure conversion rates between steps</p>
        </div>

        <FilterBar />

        {/* Funnel visualization */}
        <AnimatedSection className="mb-6">
          <ChartCard title="Sign-Up Funnel" description={`${steps.length} steps — ${overallRate}% overall conversion`}>
            <FunnelChart steps={steps} />
          </ChartCard>
        </AnimatedSection>

        {/* Charts row */}
        <AnimatedSection className="mb-6" delay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Conversion Over Time" description="Weekly end-to-end conversion rate">
              <LineChart
                data={conversionChartData}
                xKey="week"
                lines={[{ key: "Conversion Rate", name: "Conversion %", color: CHART_COLORS.primary }]}
                height={260}
              />
            </ChartCard>

            <ChartCard title="Conversion by Source" description="End-to-end conversion by acquisition channel">
              <BarChart
                data={breakdownChartData}
                xKey="name"
                bars={[{ key: "Conversion Rate", name: "Conversion %", color: CHART_COLORS.cyan }]}
                layout="vertical"
                height={260}
              />
            </ChartCard>
          </div>
        </AnimatedSection>

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />

        {/* Data table */}
        <AnimatedSection delay={200}>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">Step Breakdown</h2>
            <p className="text-sm text-gray-400">Detailed metrics for each funnel step</p>
          </div>
          <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
            <div className="relative">
              <DataTable headers={tableHeaders} rows={tableRows} />
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom badge */}
        <AnimatedSection className="mt-12 mb-8" delay={300}>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
              <span className="text-primary-400 font-semibold">{overallRate}%</span>
              <span className="text-gray-300">overall funnel conversion rate</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
