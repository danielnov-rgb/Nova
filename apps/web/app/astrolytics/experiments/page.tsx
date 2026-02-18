"use client";

import { useState } from "react";
import { experiments } from "../_data/experiments-data";
import { AnimatedSection } from "../_components/AnimatedSection";
import { FilterBar } from "../_components/FilterBar";
import { ChartCard } from "../_components/ChartCard";
import { LineChart } from "../_components/LineChart";
import { StatusBadge } from "../_components/StatusBadge";
import { CHART_COLORS } from "../_lib/colors";

type StatusFilter = "all" | "running" | "completed" | "draft";

export default function ExperimentsPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const filtered = filter === "all" ? experiments : experiments.filter((e) => e.status === filter);

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300 mb-4 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l.051.054a2.25 2.25 0 01.124 2.946l-.746 1a2.25 2.25 0 01-1.8.9H6.572a2.25 2.25 0 01-1.8-.9l-.747-1a2.25 2.25 0 01.124-2.946L4.2 14.5" />
            </svg>
            A/B Testing
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Experiments</h1>
          <p className="text-gray-400">Run and analyze A/B tests</p>
        </div>

        <FilterBar>
          <div className="flex items-center gap-2">
            {(["all", "running", "completed", "draft"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === s
                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                    : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
                }`}
              >
                {s === "all" ? `All (${experiments.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${experiments.filter((e) => e.status === s).length})`}
              </button>
            ))}
          </div>
        </FilterBar>

        {/* Experiment cards */}
        <div className="space-y-4">
          {filtered.map((exp, idx) => (
            <AnimatedSection key={exp.id} delay={idx * 80}>
              <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl hover:border-gray-700 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                <div className="relative p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-semibold text-white">{exp.name}</h3>
                        <StatusBadge status={exp.status} />
                        {exp.winner && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-400/10 text-green-400 border border-green-400/20">
                            Winner: {exp.variants.find((v) => v.key === exp.winner)?.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{exp.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Started {exp.startDate}</span>
                        {exp.endDate && <span>Ended {exp.endDate}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Variants table */}
                  {exp.variants[0]!.users > 0 && (
                    <div className="mb-4 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-800">
                            <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Variant</th>
                            <th className="text-right py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Users</th>
                            <th className="text-right py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversion</th>
                            <th className="text-right py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Improvement</th>
                            <th className="text-right py-2 pl-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Significance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exp.variants.map((v) => (
                            <tr key={v.key} className={`border-b border-gray-800/30 ${v.key === exp.winner ? "bg-green-400/5" : ""}`}>
                              <td className="py-2 pr-4">
                                <div className="flex items-center gap-2">
                                  {v.key === exp.winner && (
                                    <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                  )}
                                  <span className="text-sm text-white">{v.name}</span>
                                </div>
                              </td>
                              <td className="text-right py-2 px-4 text-sm text-gray-300">{v.users.toLocaleString()}</td>
                              <td className="text-right py-2 px-4 text-sm text-gray-300">{v.conversion}%</td>
                              <td className="text-right py-2 px-4 text-sm">
                                {v.improvement > 0 ? (
                                  <span className="text-green-400">+{v.improvement}%</span>
                                ) : (
                                  <span className="text-gray-500">Baseline</span>
                                )}
                              </td>
                              <td className="text-right py-2 pl-4">
                                <span className={`text-sm ${v.significance >= 95 ? "text-green-400" : v.significance >= 80 ? "text-amber-400" : "text-gray-400"}`}>
                                  {v.significance}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Cumulative chart */}
                  {exp.cumulativeData.length > 0 && (
                    <ChartCard title="" description="">
                      <LineChart
                        data={exp.cumulativeData.map((d) => ({ date: d.date, Control: d.control, Test: d.test }))}
                        xKey="date"
                        lines={[
                          { key: "Control", name: "Control", color: CHART_COLORS.primary },
                          { key: "Test", name: "Test", color: CHART_COLORS.green },
                        ]}
                        height={180}
                      />
                    </ChartCard>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom badge */}
        <AnimatedSection className="mt-12 mb-8" delay={400}>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
              <span className="text-primary-400 font-semibold">{experiments.filter((e) => e.status === "running").length}</span>
              <span className="text-gray-300">experiments currently running</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
