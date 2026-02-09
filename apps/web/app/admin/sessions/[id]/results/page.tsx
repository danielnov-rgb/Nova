"use client";

import { useEffect, useState } from "react";
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

export default function ResultsPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [viewMode, setViewMode] = useState<ViewMode>("overall");
  const [results, setResults] = useState<SessionResults | null>(null);
  const [groupResults, setGroupResults] = useState<ResultsByGroup | null>(null);
  const [consensus, setConsensus] = useState<ConsensusAnalysis | null>(null);
  const [participation, setParticipation] = useState<ParticipationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [sessionId]);

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
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Problem Rankings
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
                    <span
                      className={`text-lg font-bold w-8 ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                          ? "text-gray-400"
                          : index === 2
                          ? "text-amber-600"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.problem.title}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500"
                            style={{
                              width: `${(result.totalCredits / maxCredits) * 100}%`,
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
