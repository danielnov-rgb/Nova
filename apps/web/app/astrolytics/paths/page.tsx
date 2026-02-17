"use client";

import { pathsData } from "../_data/paths-data";
import { AnimatedSection } from "../_components/AnimatedSection";
import { ChartCard } from "../_components/ChartCard";
import { FilterBar } from "../_components/FilterBar";
import { DataTable } from "../_components/DataTable";
import { SankeyDiagram } from "../_components/SankeyDiagram";

export default function PathsPage() {
  const { nodes, edges, topPaths } = pathsData;

  const tableHeaders = ["Path", "Users", "Conversion", "Avg Time"];
  const tableRows = topPaths.map((p) => [
    <span key="steps" className="flex items-center gap-1 flex-wrap">
      {p.steps.map((step, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="text-sm text-white">{step}</span>
          {i < p.steps.length - 1 && (
            <svg className="w-3 h-3 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          )}
        </span>
      ))}
    </span>,
    p.users.toLocaleString(),
    p.conversion > 0 ? `${p.conversion}%` : "—",
    p.avgTime,
  ]);

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300 mb-4 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v12m0 0a3 3 0 103 3H15a3 3 0 100-6H9a3 3 0 00-3 3zm12-6a3 3 0 10-3-3" />
            </svg>
            User Flow
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Paths</h1>
          <p className="text-gray-400">Visualize how users navigate through your product</p>
        </div>

        <FilterBar>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Starting point:</span>
              <select className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-primary-500/50">
                <option>Homepage</option>
                <option>Pricing</option>
                <option>Dashboard</option>
                <option>Sign Up</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Depth:</span>
              <select className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-primary-500/50">
                <option>3 steps</option>
                <option>4 steps</option>
                <option>5 steps</option>
              </select>
            </div>
          </div>
        </FilterBar>

        {/* Sankey diagram */}
        <AnimatedSection className="mb-6">
          <ChartCard title="User Paths" description="Flow from Homepage — 3 levels deep, 8,400 users analyzed">
            <SankeyDiagram nodes={nodes} edges={edges} />
          </ChartCard>
        </AnimatedSection>

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />

        {/* Top paths table */}
        <AnimatedSection delay={200}>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">Top Paths</h2>
            <p className="text-sm text-gray-400">Most common user journeys</p>
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
              <span className="text-primary-400 font-semibold">{nodes.length}</span>
              <span className="text-gray-300">pages tracked across {edges.length} transitions</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
