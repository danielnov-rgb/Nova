"use client";

import { use } from "react";
import Link from "next/link";
import { people } from "../../_data/people-data";
import { AnimatedSection } from "../../_components/AnimatedSection";
import { ChartCard } from "../../_components/ChartCard";
import { BarChart } from "../../_components/BarChart";
import { StatusBadge } from "../../_components/StatusBadge";
import { CHART_COLORS } from "../../_lib/colors";

export default function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const person = people.find((p) => p.id === id);

  if (!person) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">User Not Found</h2>
          <Link href="/astrolytics/people" className="text-primary-400 hover:text-primary-300 text-sm">
            Back to People
          </Link>
        </div>
      </div>
    );
  }

  const activityChartData = person.activityData.map((d) => ({
    date: d.date,
    Events: d.events,
  }));

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          href="/astrolytics/people"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-400 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to People
        </Link>

        {/* User header */}
        <AnimatedSection className="mb-6">
          <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
            <div className="relative flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500/30 to-cyan-500/30 flex items-center justify-center text-lg font-bold text-primary-400 flex-shrink-0">
                {person.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white">{person.name}</h1>
                  <StatusBadge status={person.status} />
                </div>
                <p className="text-gray-400 text-sm mb-3">{person.email}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">First seen: </span>
                    <span className="text-gray-300">{person.firstSeen}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last seen: </span>
                    <span className="text-gray-300">{person.lastSeen}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Country: </span>
                    <span className="text-gray-300">{person.country}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column: Activity + Events */}
          <div className="lg:col-span-2 space-y-4">
            {/* Activity chart */}
            <AnimatedSection delay={100}>
              <ChartCard title="Activity" description="Events per day — last 14 days">
                <BarChart
                  data={activityChartData}
                  xKey="date"
                  bars={[{ key: "Events", name: "Events", color: CHART_COLORS.primary }]}
                  height={220}
                />
              </ChartCard>
            </AnimatedSection>

            {/* Recent events timeline */}
            <AnimatedSection delay={200}>
              <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Events</h3>
                  <div className="space-y-3">
                    {person.recentEvents.map((event, i) => {
                      const date = new Date(event.timestamp);
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" />
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-sm text-white">{event.event}</span>
                            <span className="text-xs text-gray-500">
                              {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                              {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right column: Properties + Cohorts + Flags */}
          <div className="space-y-4">
            {/* Properties */}
            <AnimatedSection delay={100}>
              <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Properties</h3>
                  <div className="space-y-3">
                    {Object.entries(person.properties).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{key}</span>
                        <span className="text-sm text-gray-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Cohorts */}
            <AnimatedSection delay={200}>
              <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Cohorts</h3>
                  <div className="flex flex-wrap gap-2">
                    {person.cohorts.map((cohort) => (
                      <span
                        key={cohort}
                        className="px-2.5 py-1 rounded-md bg-primary-500/10 text-primary-400 text-xs font-medium border border-primary-500/20"
                      >
                        {cohort}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Feature flags */}
            <AnimatedSection delay={300}>
              <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Feature Flags</h3>
                  <div className="space-y-3">
                    {person.featureFlags.map((flag) => (
                      <div key={flag.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 font-mono text-xs">{flag.name}</span>
                        <span className={`text-xs font-medium ${flag.value ? "text-green-400" : "text-gray-500"}`}>
                          {String(flag.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
