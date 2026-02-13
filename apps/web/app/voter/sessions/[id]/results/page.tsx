"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { voterSessionsApi, VoterSessionResults } from "../../../_lib/api";
import { isAuthenticated } from "../../../_lib/auth";
import { NovaLogo } from "../../../../_components/shared/NovaLogo";

export default function VoterResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [results, setResults] = useState<VoterSessionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/voter/login");
      return;
    }
    fetchResults();
  }, [sessionId, router]);

  async function fetchResults() {
    try {
      const data = await voterSessionsApi.getResults(sessionId);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cannot View Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link
            href="/voter/dashboard"
            className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const maxCredits = Math.max(...results.results.map((r) => r.totalCredits), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <NovaLogo size="sm" />
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Voting Results</span>
          </div>
          <Link
            href="/voter/dashboard"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Session info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {results.session.title}
          </h1>
          {results.session.description && (
            <p className="text-gray-600 dark:text-gray-400">{results.session.description}</p>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Votes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {results.myVoting.voteCount}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Credits Used</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {results.myVoting.creditsUsed} / {results.myVoting.creditsAllowed}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Voters</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {results.summary.completedVoters} / {results.summary.totalVoters}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Problems</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {results.results.length}
            </p>
          </div>
        </div>

        {/* Results list */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Problem Rankings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sorted by total credits received from all voters
            </p>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {results.results.map((result) => (
              <div
                key={result.problem.id}
                className={`p-6 ${result.myVote ? "bg-primary-50/50 dark:bg-primary-900/10" : ""}`}
              >
                <div className="flex items-start gap-4">
                  {/* Rank badge */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      result.rank === 1
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : result.rank === 2
                        ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        : result.rank === 3
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {result.rank}
                  </div>

                  {/* Problem info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {result.problem.title}
                    </h3>
                    {result.problem.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {result.problem.description}
                      </p>
                    )}

                    {/* Tags */}
                    {result.problem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {result.problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                          style={{ width: `${(result.totalCredits / maxCredits) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[80px] text-right">
                        {result.totalCredits} credits
                      </span>
                    </div>

                    {/* Voter count */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {result.voterCount} {result.voterCount === 1 ? "voter" : "voters"}
                    </p>
                  </div>

                  {/* My vote indicator */}
                  {result.myVote && (
                    <div className="flex-shrink-0 text-right">
                      <div className="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg">
                        <p className="text-xs font-medium mb-0.5">Your vote</p>
                        <p className="text-lg font-bold">{result.myVote.credits}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thank you message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Thank you for voting!</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Your input helps prioritize the most important problems.
          </p>
        </div>
      </main>
    </div>
  );
}
