"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { voterSessionsApi, VoterSessionDetail } from "../../_lib/api";
import { isAuthenticated, getUser } from "../../_lib/auth";

interface VoteAllocation {
  problemId: string;
  credits: number;
}

export default function VoterSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [sessionData, setSessionData] = useState<VoterSessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votes, setVotes] = useState<VoteAllocation[]>([]);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/voter/login?redirect=${encodeURIComponent(`/voter/sessions/${sessionId}`)}`);
      return;
    }
    fetchSession();
  }, [sessionId, router]);

  async function fetchSession() {
    try {
      const data = await voterSessionsApi.getDetail(sessionId);
      setSessionData(data);
      // Initialize votes from existing myVote on each problem
      const existingVotes = data.problems
        .filter((p) => p.myVote)
        .map((p) => ({
          problemId: p.id,
          credits: p.myVote!.credits,
        }));
      setVotes(existingVotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
    } finally {
      setLoading(false);
    }
  }

  function getCreditsForProblem(problemId: string): number {
    return votes.find((v) => v.problemId === problemId)?.credits || 0;
  }

  function getTotalCreditsUsed(): number {
    return votes.reduce((sum, v) => sum + v.credits, 0);
  }

  function getCreditsRemaining(): number {
    if (!sessionData) return 0;
    return sessionData.creditsAllowed - getTotalCreditsUsed();
  }

  function handleVoteChange(problemId: string, credits: number) {
    setHasUnsavedChanges(true);
    setVotes((prev) => {
      const existing = prev.find((v) => v.problemId === problemId);
      if (existing) {
        if (credits === 0) {
          return prev.filter((v) => v.problemId !== problemId);
        }
        return prev.map((v) =>
          v.problemId === problemId ? { ...v, credits } : v
        );
      } else if (credits > 0) {
        return [...prev, { problemId, credits }];
      }
      return prev;
    });
  }

  async function handleSave() {
    if (!sessionData || votes.length === 0) return;

    setSaving(true);
    setError(null);

    try {
      await voterSessionsApi.castBulkVotes(sessionId, votes);
      setHasUnsavedChanges(false);
      // Refresh to get updated data
      await fetchSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save votes");
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete() {
    if (!confirm("Are you sure you want to submit your final votes? You won't be able to change them after.")) {
      return;
    }

    setCompleting(true);
    setError(null);

    try {
      // Save any pending votes first
      if (hasUnsavedChanges && votes.length > 0) {
        await voterSessionsApi.castBulkVotes(sessionId, votes);
      }
      // Mark as complete
      await voterSessionsApi.markComplete(sessionId);
      // Redirect to dashboard
      router.push("/voter/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete session");
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error && !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Link
              href="/voter/dashboard"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionData) return null;

  const { session, problems, completedAt } = sessionData;
  const isCompleted = !!completedAt;
  const deadline = session.deadline ? new Date(session.deadline) : null;
  const isExpired = deadline && deadline < new Date();
  const canVote = !isCompleted && !isExpired && session.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/voter/dashboard"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 mb-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {session.title}
              </h1>
            </div>

            {/* Credits indicator */}
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {getCreditsRemaining()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                credits remaining
              </div>
            </div>
          </div>

          {/* Status bar */}
          {isCompleted && (
            <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-600 dark:text-green-400 text-center">
              You have completed this voting session
            </div>
          )}
          {isExpired && !isCompleted && (
            <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
              The deadline for this session has passed
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {session.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {session.description}
          </p>
        )}

        {/* Problems list */}
        <div className="space-y-4 mb-8">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              credits={getCreditsForProblem(problem.id)}
              maxCredits={getCreditsForProblem(problem.id) + getCreditsRemaining()}
              onCreditsChange={(credits) => handleVoteChange(problem.id, credits)}
              disabled={!canVote}
            />
          ))}
        </div>

        {/* Action buttons */}
        {canVote && (
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 -mx-4 flex items-center justify-between gap-4">
            <button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving..." : "Save Progress"}
            </button>
            <button
              onClick={handleComplete}
              disabled={completing || votes.length === 0}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors"
            >
              {completing ? "Submitting..." : "Submit Final Votes"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

interface ProblemCardProps {
  problem: {
    id: string;
    title: string;
    description: string | null;
    tags: string[];
  };
  credits: number;
  maxCredits: number;
  onCreditsChange: (credits: number) => void;
  disabled: boolean;
}

function ProblemCard({
  problem,
  credits,
  maxCredits,
  onCreditsChange,
  disabled,
}: ProblemCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {problem.title}
            </h3>
            {problem.tags?.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {problem.tags[0]}
              </span>
            )}
          </div>
          {problem.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {problem.description}
            </p>
          )}
        </div>

        {/* Credits input */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCreditsChange(Math.max(0, credits - 1))}
            disabled={disabled || credits === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <input
            type="number"
            value={credits}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              onCreditsChange(Math.min(Math.max(0, val), maxCredits));
            }}
            disabled={disabled}
            className="w-16 text-center py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
            min={0}
            max={maxCredits}
          />
          <button
            onClick={() => onCreditsChange(Math.min(maxCredits, credits + 1))}
            disabled={disabled || credits >= maxCredits}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Visual credits bar */}
      {credits > 0 && (
        <div className="mt-3 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-200"
            style={{ width: `${Math.min(100, (credits / 10) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
