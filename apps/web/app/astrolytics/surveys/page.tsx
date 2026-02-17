"use client";

import { useState } from "react";
import { surveys } from "../_data/surveys-data";
import { AnimatedSection } from "../_components/AnimatedSection";
import { FilterBar } from "../_components/FilterBar";
import { StatusBadge } from "../_components/StatusBadge";
import { BarChart } from "../_components/BarChart";
import { CHART_COLORS } from "../_lib/colors";

type StatusFilter = "all" | "active" | "completed" | "draft";

function NpsDisplay({ score, breakdown }: { score: number; breakdown: { detractors: number; passives: number; promoters: number } }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent mb-2">{score}</div>
      <div className="text-xs text-gray-400 mb-3">Net Promoter Score</div>
      <div className="flex rounded-full overflow-hidden h-2 mb-2">
        <div className="bg-red-400" style={{ width: `${breakdown.detractors}%` }} />
        <div className="bg-amber-400" style={{ width: `${breakdown.passives}%` }} />
        <div className="bg-green-400" style={{ width: `${breakdown.promoters}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>{breakdown.detractors}% Detractors</span>
        <span>{breakdown.passives}% Passive</span>
        <span>{breakdown.promoters}% Promoters</span>
      </div>
    </div>
  );
}

function CsatDisplay({ score }: { score: number }) {
  const stars = Math.round(score);
  return (
    <div className="text-center">
      <div className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent mb-2">
        {score.toFixed(1)}
      </div>
      <div className="flex items-center justify-center gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i <= stars ? "text-amber-400" : "text-gray-700"}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <div className="text-xs text-gray-400">Customer Satisfaction</div>
    </div>
  );
}

export default function SurveysPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const filtered = filter === "all" ? surveys : surveys.filter((s) => s.status === filter);

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300 mb-4 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            User Feedback
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Surveys</h1>
          <p className="text-gray-400">Collect and analyze user feedback</p>
        </div>

        <FilterBar>
          <div className="flex items-center gap-2">
            {(["all", "active", "completed", "draft"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === s
                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                    : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-gray-300"
                }`}
              >
                {s === "all" ? `All (${surveys.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${surveys.filter((sv) => sv.status === s).length})`}
              </button>
            ))}
          </div>
        </FilterBar>

        {/* Survey cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((survey, idx) => (
            <AnimatedSection key={survey.id} delay={idx * 80}>
              <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white">{survey.name}</h3>
                        <StatusBadge status={survey.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{survey.responseCount.toLocaleString()} responses</span>
                        {survey.responseRate > 0 && <span>{survey.responseRate}% response rate</span>}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-800 text-gray-400 border border-gray-700 uppercase">
                      {survey.type.replace("_", " ")}
                    </span>
                  </div>

                  {/* Results by type */}
                  {survey.type === "nps" && survey.results.npsScore !== undefined && survey.results.npsBreakdown && (
                    <NpsDisplay score={survey.results.npsScore} breakdown={survey.results.npsBreakdown} />
                  )}

                  {survey.type === "csat" && survey.results.csatScore !== undefined && survey.results.csatScore > 0 && (
                    <CsatDisplay score={survey.results.csatScore} />
                  )}

                  {survey.type === "multiple_choice" && survey.results.choices && (
                    <BarChart
                      data={survey.results.choices.map((c) => ({ name: c.label, Responses: c.count }))}
                      xKey="name"
                      bars={[{ key: "Responses", name: "Responses", color: CHART_COLORS.primary }]}
                      layout="vertical"
                      height={200}
                    />
                  )}

                  {survey.type === "open_text" && survey.results.responses && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {survey.results.responses.map((r, i) => (
                        <div key={i} className="bg-gray-800/30 rounded-lg px-3 py-2">
                          <p className="text-sm text-gray-300 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                          <span className="text-[10px] text-gray-600 mt-1 block">
                            {new Date(r.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {survey.type === "csat" && survey.results.csatScore === 0 && (
                    <div className="text-center py-6 text-sm text-gray-600">No responses yet</div>
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
              <span className="text-primary-400 font-semibold">{surveys.reduce((s, sv) => s + sv.responseCount, 0).toLocaleString()}</span>
              <span className="text-gray-300">total survey responses collected</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
