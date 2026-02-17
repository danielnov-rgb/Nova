"use client";

import { dashboardData } from "../_data/dashboard-data";
import { AnimatedSection } from "../_components/AnimatedSection";
import { MetricCard } from "../_components/MetricCard";
import { ChartCard } from "../_components/ChartCard";
import { FilterBar } from "../_components/FilterBar";
import { StatusBadge } from "../_components/StatusBadge";
import { AreaChart } from "../_components/AreaChart";
import { BarChart } from "../_components/BarChart";
import { LineChart } from "../_components/LineChart";
import { CHART_COLORS } from "../_lib/colors";

const insightIcons: Record<string, React.ReactNode> = {
  positive: (
    <div className="w-10 h-10 rounded-lg bg-green-400/10 flex items-center justify-center">
      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    </div>
  ),
  neutral: (
    <div className="w-10 h-10 rounded-lg bg-primary-400/10 flex items-center justify-center">
      <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    </div>
  ),
  warning: (
    <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center">
      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </div>
  ),
};

export default function DashboardPage() {
  const { metrics, userActivity, topEvents, weeklyActiveUsers, recentFlags, activeExperiments, insights } = dashboardData;

  return (
    <div className="relative min-h-screen">
      {/* Background gradient orbs — same as together-poc HeroSection */}
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300 mb-4 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live Analytics
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Overview of your product analytics</p>
        </div>

        <FilterBar />

        {/* KPI Metrics */}
        <AnimatedSection className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
              <div key={metric.label} style={{ transitionDelay: `${i * 100}ms` }}>
                <MetricCard
                  label={metric.label}
                  value={metric.value}
                  change={metric.change}
                  changeLabel={metric.changeLabel}
                />
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* User Activity + Top Events */}
        <AnimatedSection className="mb-6" delay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="User Activity" description="Daily, weekly, and monthly active users">
              <AreaChart
                data={userActivity}
                xKey="date"
                areas={[
                  { key: "mau", name: "MAU", color: CHART_COLORS.primary },
                  { key: "wau", name: "WAU", color: CHART_COLORS.cyan },
                  { key: "dau", name: "DAU", color: CHART_COLORS.blue },
                ]}
                height={280}
              />
            </ChartCard>

            <ChartCard title="Top Events" description="Most frequent events in the last 30 days">
              <BarChart
                data={topEvents}
                xKey="name"
                bars={[{ key: "count", name: "Count", color: CHART_COLORS.primary }]}
                layout="vertical"
                height={280}
              />
            </ChartCard>
          </div>
        </AnimatedSection>

        {/* Weekly Active Users Trend */}
        <AnimatedSection className="mb-6" delay={200}>
          <ChartCard title="Weekly Active Users" description="12-week trend">
            <LineChart
              data={weeklyActiveUsers}
              xKey="week"
              lines={[{ key: "users", name: "Users", color: CHART_COLORS.primary }]}
              height={240}
            />
          </ChartCard>
        </AnimatedSection>

        {/* Section divider — from together-poc */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />

        {/* Mini Cards Row */}
        <AnimatedSection className="mb-6" delay={300}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recent Feature Flags */}
            <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
              <div className="relative">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Feature Flags</h3>
                <div className="space-y-3">
                  {recentFlags.map((flag) => (
                    <div key={flag.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={flag.status} />
                        <span className="text-sm text-white">{flag.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{flag.rollout}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Experiments */}
            <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
              <div className="relative">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Active Experiments</h3>
                <div className="space-y-3">
                  {activeExperiments.map((exp) => (
                    <div key={exp.name} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white">{exp.name}</div>
                        <div className="text-xs text-gray-500">{exp.variant} leading</div>
                      </div>
                      <span className="text-sm font-medium text-green-400">+{exp.improvement}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* NPS Score */}
            <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
              <div className="relative text-center">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Latest NPS</h3>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent mb-1">72</div>
                <div className="text-sm text-gray-400 mb-3">Net Promoter Score</div>
                <div className="flex rounded-full overflow-hidden h-2">
                  <div className="bg-red-400" style={{ width: "8%" }} />
                  <div className="bg-amber-400" style={{ width: "20%" }} />
                  <div className="bg-green-400" style={{ width: "72%" }} />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-gray-500">
                  <span>8% Detractors</span>
                  <span>20% Passive</span>
                  <span>72% Promoters</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />

        {/* Quick Insights */}
        <AnimatedSection delay={400}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Quick Insights</h2>
            <p className="text-sm text-gray-400">AI-generated observations from your data</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <div className="mb-3">{insightIcons[insight.type]}</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Bottom gradient badge — like together-poc summary badge */}
        <AnimatedSection className="mt-12 mb-8" delay={500}>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
              <span className="text-primary-400 font-semibold">48,392</span>
              <span className="text-gray-300">events tracked in the last 24 hours</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
