"use client";

import { useState } from "react";
import { featureFlags } from "../_data/feature-flags-data";
import { AnimatedSection } from "../_components/AnimatedSection";
import { FilterBar } from "../_components/FilterBar";
import { StatusBadge } from "../_components/StatusBadge";

type StatusFilter = "all" | "active" | "paused" | "draft";

export default function FeatureFlagsPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === "all" ? featureFlags : featureFlags.filter((f) => f.status === filter);

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300 mb-4 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
            Release Management
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Feature Flags</h1>
          <p className="text-gray-400">Control feature rollouts and targeting</p>
        </div>

        {/* Filters */}
        <FilterBar>
          <div className="flex items-center gap-2">
            {(["all", "active", "paused", "draft"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === s
                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                    : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300 hover:border-gray-600"
                }`}
              >
                {s === "all" ? `All (${featureFlags.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${featureFlags.filter((f) => f.status === s).length})`}
              </button>
            ))}
          </div>
        </FilterBar>

        {/* Flag cards */}
        <AnimatedSection>
          <div className="space-y-3">
            {filtered.map((flag) => {
              const isExpanded = expandedId === flag.id;
              return (
                <div
                  key={flag.id}
                  className="group relative bg-gray-900/50 border border-gray-800 rounded-xl hover:border-gray-700 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                  <div className="relative">
                    {/* Main row */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : flag.id)}
                      className="w-full flex items-center gap-4 p-5 text-left"
                    >
                      {/* Toggle indicator */}
                      <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors flex-shrink-0 ${
                        flag.status === "active" ? "bg-green-500/30" : "bg-gray-700"
                      }`}>
                        <div className={`w-4 h-4 rounded-full transition-all ${
                          flag.status === "active" ? "bg-green-400 translate-x-4" : "bg-gray-500 translate-x-0"
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-semibold text-white">{flag.name}</span>
                          <StatusBadge status={flag.status} />
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-800 text-gray-400 border border-gray-700">
                            {flag.type === "boolean" ? "Boolean" : "Multivariate"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">{flag.key}</div>
                      </div>

                      {/* Rollout bar */}
                      <div className="w-32 flex-shrink-0 hidden sm:block">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>Rollout</span>
                          <span>{flag.rolloutPercentage}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full transition-all"
                            style={{ width: `${flag.rolloutPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Expand chevron */}
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-0 border-t border-gray-800/50">
                        <p className="text-sm text-gray-400 mt-4 mb-4">{flag.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Variants */}
                          {flag.variants && flag.variants.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Variants</h4>
                              <div className="space-y-2">
                                {flag.variants.map((v) => (
                                  <div key={v.key} className="flex items-center justify-between bg-gray-800/30 rounded-lg px-3 py-2">
                                    <div>
                                      <span className="text-sm text-white">{v.name}</span>
                                      <span className="text-xs text-gray-500 font-mono ml-2">({v.key})</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{v.rollout}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Filters */}
                          {flag.filters && flag.filters.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Targeting Rules</h4>
                              <div className="space-y-2">
                                {flag.filters.map((f, i) => (
                                  <div key={i} className="flex items-center gap-2 bg-gray-800/30 rounded-lg px-3 py-2">
                                    <span className="text-xs text-gray-400">{f.property}</span>
                                    <span className="text-xs text-primary-400 font-medium">{f.operator}</span>
                                    <span className="text-xs text-white">{f.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 text-xs text-gray-600">Created {flag.createdAt}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Bottom badge */}
        <AnimatedSection className="mt-12 mb-8" delay={200}>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
              <span className="text-primary-400 font-semibold">{featureFlags.filter((f) => f.status === "active").length}</span>
              <span className="text-gray-300">flags currently active</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
