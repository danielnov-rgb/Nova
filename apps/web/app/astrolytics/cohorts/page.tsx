"use client";

import { useState } from "react";
import { cohorts } from "../_data/cohorts-data";
import { AnimatedSection } from "../_components/AnimatedSection";
import { FilterBar } from "../_components/FilterBar";
import { LineChart } from "../_components/LineChart";
import { CHART_COLORS } from "../_lib/colors";
import { formatNumber } from "../_lib/formatters";

export default function CohortsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300 mb-4 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            User Segments
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Cohorts</h1>
          <p className="text-gray-400">Group users by shared behaviors and properties</p>
        </div>

        <FilterBar />

        {/* Cohorts table */}
        <AnimatedSection>
          <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
            <div className="relative overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Size</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Calculated</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-10" />
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((cohort) => {
                    const isExpanded = expandedId === cohort.id;
                    return (
                      <tr key={cohort.id} className="group/row">
                        <td colSpan={6} className="p-0">
                          {/* Main row */}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : cohort.id)}
                            className="w-full flex items-center hover:bg-primary-500/5 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm font-medium text-white">{cohort.name}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                cohort.type === "dynamic"
                                  ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                                  : "bg-gray-800 text-gray-400 border border-gray-700"
                              }`}>
                                {cohort.type === "dynamic" ? "Dynamic" : "Static"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right text-sm font-semibold text-white">{formatNumber(cohort.size)}</td>
                            <td className="py-3 px-4 text-sm text-gray-400">{cohort.created}</td>
                            <td className="py-3 px-4 text-sm text-gray-400">{cohort.lastCalculated}</td>
                            <td className="py-3 px-4 text-center">
                              <svg
                                className={`w-4 h-4 text-gray-500 transition-transform inline ${isExpanded ? "rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </td>
                          </button>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-gray-800/50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {/* Filters */}
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Filter Criteria</h4>
                                  <div className="bg-gray-800/30 rounded-lg px-3 py-2">
                                    <span className="text-sm text-gray-300 font-mono text-xs">{cohort.filters}</span>
                                  </div>
                                </div>
                                {/* Size over time mini chart */}
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Size Over Time</h4>
                                  <LineChart
                                    data={cohort.sizeOverTime.map((d) => ({ date: d.date, Users: d.size }))}
                                    xKey="date"
                                    lines={[{ key: "Users", name: "Users", color: CHART_COLORS.primary }]}
                                    height={120}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom badge */}
        <AnimatedSection className="mt-12 mb-8" delay={200}>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
              <span className="text-primary-400 font-semibold">{cohorts.length}</span>
              <span className="text-gray-300">cohorts tracking {formatNumber(cohorts.reduce((s, c) => s + c.size, 0))} users</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
