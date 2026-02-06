"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { sessionsApi } from "../../../_lib/api";
import type { SessionResults, ProblemResult } from "../../../_lib/types";

export default function ResultsPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [results, setResults] = useState<SessionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [sessionId]);

  async function fetchResults() {
    try {
      const data = await sessionsApi.getResults(sessionId);
      setResults(data);
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
      <div className="grid grid-cols-4 gap-4 mb-8">
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

      {/* Rankings */}
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
                                "{vote.comment}"
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
    </div>
  );
}
