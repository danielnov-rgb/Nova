"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  sessionsApi,
  ResultsByGroup,
  ConsensusAnalysis,
  ParticipationStats,
} from "../../../_lib/api";
import type { SessionResults } from "../../../_lib/types";

type ViewMode = "overall" | "by-group" | "consensus";
type ResultsViewType = "podium" | "list" | "chart";

export default function ResultsPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [viewMode, setViewMode] = useState<ViewMode>("overall");
  const [resultsViewType, setResultsViewType] = useState<ResultsViewType>("podium");
  const [results, setResults] = useState<SessionResults | null>(null);
  const [groupResults, setGroupResults] = useState<ResultsByGroup | null>(null);
  const [consensus, setConsensus] = useState<ConsensusAnalysis | null>(null);
  const [participation, setParticipation] = useState<ParticipationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [sessionId]);

  // Trigger animation after results load
  useEffect(() => {
    if (results) {
      const timer = setTimeout(() => setAnimationReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [results]);

  async function fetchResults() {
    try {
      const [resultsData, groupData, consensusData, participationData] = await Promise.all([
        sessionsApi.getResults(sessionId),
        sessionsApi.getResultsByGroup(sessionId),
        sessionsApi.getConsensusAnalysis(sessionId),
        sessionsApi.getParticipationStats(sessionId),
      ]);
      setResults(resultsData);
      setGroupResults(groupData);
      setConsensus(consensusData);
      setParticipation(participationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results");
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    if (!results) return;

    const rows = [["Rank", "Problem", "Total Credits", "Voters"]];
    results.results.forEach((r, i) => {
      rows.push([
        String(i + 1),
        r.problem.title,
        String(r.totalCredits),
        String(r.voterCount),
      ]);
    });

    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${results.session.title.replace(/\s+/g, "_")}_results.csv`;
    a.click();
  }

  function exportJSON() {
    if (!results) return;

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${results.session.title.replace(/\s+/g, "_")}_results.json`;
    a.click();
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error || "Results not found"}</p>
        </div>
      </div>
    );
  }

  const maxCredits = Math.max(...results.results.map((r) => r.totalCredits), 1);
  const participationRate = results.linkStats.total > 0
    ? Math.round((results.linkStats.used / results.linkStats.total) * 100)
    : 0;

  const hasGroups = groupResults && groupResults.groups.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/admin/sessions/${sessionId}`}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to session
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Voting Results
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {results.session.title}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={exportJSON}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Votes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {results.totalVotes}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Credits Used</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {results.totalCreditsUsed}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Voters</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {results.linkStats.used} / {results.linkStats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Participation</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {participationRate}%
          </p>
        </div>
      </div>

      {/* View Mode Tabs */}
      {hasGroups && (
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setViewMode("overall")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "overall"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Overall Rankings
          </button>
          <button
            onClick={() => setViewMode("by-group")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "by-group"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            By Group
          </button>
          <button
            onClick={() => setViewMode("consensus")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "consensus"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Consensus
          </button>
        </div>
      )}

      {/* Overall Rankings View */}
      {viewMode === "overall" && (
        <div className="space-y-6">
          {/* View type selector */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setResultsViewType("podium")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  resultsViewType === "podium"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <TrophyIcon className="w-4 h-4" />
                  Podium
                </span>
              </button>
              <button
                onClick={() => setResultsViewType("chart")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  resultsViewType === "chart"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ChartIcon className="w-4 h-4" />
                  Chart
                </span>
              </button>
              <button
                onClick={() => setResultsViewType("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  resultsViewType === "list"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ListIcon className="w-4 h-4" />
                  List
                </span>
              </button>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1.5 print:hidden"
            >
              <PrintIcon className="w-4 h-4" />
              Print
            </button>
          </div>

          {/* Podium View */}
          {resultsViewType === "podium" && results.results.length >= 3 && (
            <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 print:border-none">
              <h2 className="text-center text-lg font-semibold text-gray-900 dark:text-white mb-8">
                Top 3 Priorities
              </h2>
              <div className="flex items-end justify-center gap-4 mb-8">
                {/* 2nd Place */}
                <div className="flex flex-col items-center w-40">
                  <div className={`mb-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-center transition-all duration-500 ${animationReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2" title={results.results[1]?.problem.title}>
                      {results.results[1]?.problem.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{results.results[1]?.totalCredits} credits</p>
                  </div>
                  <div className={`w-full bg-gradient-to-t from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-500 rounded-t-lg flex items-end justify-center transition-all duration-700 ${animationReady ? 'h-24' : 'h-0'}`} style={{ transitionDelay: '200ms' }}>
                    <span className="text-4xl font-bold text-gray-500 dark:text-gray-300 mb-2">2</span>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center w-44">
                  <div className="mb-2 text-yellow-500">
                    <svg className={`w-10 h-10 transition-all duration-500 ${animationReady ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className={`mb-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center transition-all duration-500 ${animationReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2" title={results.results[0]?.problem.title}>
                      {results.results[0]?.problem.title}
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 font-semibold">{results.results[0]?.totalCredits} credits</p>
                  </div>
                  <div className={`w-full bg-gradient-to-t from-yellow-400 to-yellow-300 dark:from-yellow-600 dark:to-yellow-500 rounded-t-lg flex items-end justify-center shadow-lg transition-all duration-700 ${animationReady ? 'h-32' : 'h-0'}`}>
                    <span className="text-5xl font-bold text-yellow-700 dark:text-yellow-900 mb-2">1</span>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center w-40">
                  <div className={`mb-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center transition-all duration-500 ${animationReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2" title={results.results[2]?.problem.title}>
                      {results.results[2]?.problem.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{results.results[2]?.totalCredits} credits</p>
                  </div>
                  <div className={`w-full bg-gradient-to-t from-amber-700 to-amber-600 dark:from-amber-800 dark:to-amber-700 rounded-t-lg flex items-end justify-center transition-all duration-700 ${animationReady ? 'h-16' : 'h-0'}`} style={{ transitionDelay: '400ms' }}>
                    <span className="text-3xl font-bold text-amber-200 mb-2">3</span>
                  </div>
                </div>
              </div>

              {/* Runner-ups */}
              {results.results.length > 3 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">Runner-ups</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {results.results.slice(3, 7).map((result, i) => (
                      <div key={result.problem.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <span className="text-xs font-bold text-gray-400">#{i + 4}</span>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                          {result.problem.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{result.totalCredits} credits</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chart View */}
          {resultsViewType === "chart" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-6">
                Credit Distribution
              </h2>
              <div className="space-y-3">
                {results.results.slice(0, 10).map((result, index) => (
                  <div key={result.problem.id} className="flex items-center gap-4">
                    <span className={`text-sm font-bold w-6 ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-amber-600' :
                      'text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate pr-4">
                          {result.problem.title}
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white flex-shrink-0">
                          {result.totalCredits}
                        </span>
                      </div>
                      <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                        <div
                          className={`h-full rounded-lg transition-all duration-1000 ease-out ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                            index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-500 dark:to-gray-600' :
                            index === 2 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                            'bg-gradient-to-r from-primary-400 to-primary-500'
                          }`}
                          style={{
                            width: animationReady ? `${(result.totalCredits / maxCredits) * 100}%` : '0%',
                            transitionDelay: `${index * 100}ms`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {result.voterCount} voter{result.voterCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {results.results.length > 10 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Showing top 10 of {results.results.length} problems
                </p>
              )}
            </div>
          )}

          {/* List View */}
          {resultsViewType === "list" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  All Rankings
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Click on a problem to see individual votes
                </p>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {results.results.map((result, index) => (
                  <div key={result.problem.id}>
                    <button
                      onClick={() =>
                        setExpandedProblem(
                          expandedProblem === result.problem.id ? null : result.problem.id
                        )
                      }
                      className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300' :
                          index === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {result.problem.title}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  index === 0 ? 'bg-yellow-500' :
                                  index === 1 ? 'bg-gray-400' :
                                  index === 2 ? 'bg-amber-500' :
                                  'bg-primary-500'
                                }`}
                                style={{
                                  width: animationReady ? `${(result.totalCredits / maxCredits) * 100}%` : '0%',
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white w-16 text-right">
                              {result.totalCredits}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {result.voterCount} voter{result.voterCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedProblem === result.problem.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded votes */}
                    {expandedProblem === result.problem.id && (
                      <div className="px-4 pb-4 pl-16">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                          {result.votes.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No votes yet
                            </p>
                          ) : (
                            result.votes.map((vote, i) => (
                              <div
                                key={i}
                                className="flex items-start justify-between text-sm"
                              >
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {vote.voter.name || vote.voter.email}
                                  </p>
                                  {vote.comment && (
                                    <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                                      &quot;{vote.comment}&quot;
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {vote.credits} credits
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(vote.votedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* By Group View */}
      {viewMode === "by-group" && groupResults && (
        <div className="space-y-6">
          {/* Participation Stats */}
          {participation && participation.groups.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                Participation by Group
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {participation.groups.map((g) => (
                  <div
                    key={g.group.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {g.group.name}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${g.participationRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {g.participationRate}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {g.votersParticipated} of {g.totalMembers} members voted
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Side-by-side rankings */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Rankings by Group
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left p-3 text-sm font-medium text-gray-500 dark:text-gray-400 w-12">
                      #
                    </th>
                    {groupResults.groups.map((g) => (
                      <th
                        key={g.group.id}
                        className="text-left p-3 text-sm font-medium text-gray-500 dark:text-gray-400"
                      >
                        <div>{g.group.name}</div>
                        <div className="text-xs font-normal">
                          {g.totalVoters} voters, {g.totalCredits} credits
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.min(10, groupResults.groups[0]?.rankings.length || 0) }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="p-3 text-sm font-bold text-gray-400">
                        {i + 1}
                      </td>
                      {groupResults.groups.map((g) => {
                        const problem = g.rankings[i];
                        return (
                          <td key={g.group.id} className="p-3">
                            {problem && (
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {problem.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {problem.totalCredits} credits, {problem.voterCount} voters
                                </p>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Consensus View */}
      {viewMode === "consensus" && consensus && (
        <div className="space-y-6">
          {!consensus.hasMultipleGroups ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Consensus analysis requires at least 2 voter groups.
              </p>
            </div>
          ) : (
            <>
              {/* Consensus - Where groups agree */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      High Agreement
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Problems where all groups ranked similarly (within top 5, rank difference &le; 3)
                  </p>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {consensus.consensus.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No high-agreement problems found
                    </div>
                  ) : (
                    consensus.consensus.map((item) => (
                      <div key={item.problem.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.problem.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Average rank: #{item.avgRank}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            High agreement
                          </span>
                        </div>
                        <div className="flex gap-4 mt-3">
                          {item.ranksByGroup.map((r) => (
                            <div key={r.groupId} className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">{r.groupName}:</span>{" "}
                              <span className="font-medium text-gray-900 dark:text-white">#{r.rank}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Conflicts - Where groups disagree */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Conflicting Views
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Problems where groups ranked very differently (rank difference &ge; 5)
                  </p>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {consensus.conflicts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No conflicting priorities found
                    </div>
                  ) : (
                    consensus.conflicts.map((item) => (
                      <div key={item.problem.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.problem.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Rank difference: {item.rankDiff} positions
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Conflict
                          </span>
                        </div>
                        <div className="flex gap-4 mt-3">
                          {item.ranksByGroup.map((r) => (
                            <div key={r.groupId} className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">{r.groupName}:</span>{" "}
                              <span className="font-medium text-gray-900 dark:text-white">#{r.rank}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Icon components
function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M5 3v4a7 7 0 007 7m-7-7H3m16 0h-2m2 0v4a7 7 0 01-7 7m0 0v3m0-3h-3m3 0h3m-6 3h6" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

function PrintIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  );
}
