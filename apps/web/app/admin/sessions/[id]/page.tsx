"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { sessionsApi } from "../../_lib/api";
import type { VotingSession, SessionStatus } from "../../_lib/types";

const statusConfig: Record<SessionStatus, { label: string; className: string; nextStatus?: SessionStatus; nextLabel?: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    nextStatus: "ACTIVE",
    nextLabel: "Activate",
  },
  ACTIVE: {
    label: "Active",
    className: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    nextStatus: "CLOSED",
    nextLabel: "Close Voting",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    nextStatus: "ARCHIVED",
    nextLabel: "Archive",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
};

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<VotingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  async function fetchSession() {
    try {
      const data = await sessionsApi.get(sessionId);
      setSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(status: SessionStatus) {
    if (!session) return;
    setUpdating(true);
    try {
      await sessionsApi.update(sessionId, { status });
      await fetchSession();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  async function togglePublic() {
    if (!session) return;
    setUpdating(true);
    try {
      await sessionsApi.update(sessionId, { isPublic: !session.isPublic });
      await fetchSession();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update session");
    } finally {
      setUpdating(false);
    }
  }

  function getPublicUrl() {
    if (!session?.publicToken) return "";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/voter/join/${session.publicToken}`;
  }

  function copyPublicLink() {
    const url = getPublicUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  if (error || !session) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error || "Session not found"}</p>
          <Link
            href="/admin/sessions"
            className="mt-4 inline-block text-primary-600 dark:text-primary-400 hover:underline"
          >
            Back to sessions
          </Link>
        </div>
      </div>
    );
  }

  const status = session.status as SessionStatus;
  const config = statusConfig[status];
  const totalVotes = session.problems.reduce((sum, p) => sum + p.voterCount, 0);
  const totalCredits = session.problems.reduce((sum, p) => sum + p.totalCredits, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/sessions"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to sessions
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {session.title}
              </h1>
              <span className={`text-xs px-2 py-1 rounded-full ${config.className}`}>
                {config.label}
              </span>
            </div>
            {session.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">{session.description}</p>
            )}
          </div>

          <div className="flex gap-2">
            {config.nextStatus && (
              <button
                onClick={() => updateStatus(config.nextStatus!)}
                disabled={updating}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {updating ? "..." : config.nextLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Problems</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {session.problems.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Votes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVotes}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Credits Used</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCredits}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Deadline</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {session.deadline ? new Date(session.deadline).toLocaleDateString() : "None"}
          </p>
        </div>
      </div>

      {/* Public Link Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Public Voting Link</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enable a shareable link that requires voters to register/login
            </p>
          </div>
          <button
            onClick={togglePublic}
            disabled={updating}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              session.isPublic ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                session.isPublic ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {session.isPublic && session.publicToken && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={getPublicUrl()}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
            <button
              onClick={copyPublicLink}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors text-sm"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        )}

        {session.isPublic && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Voters will receive {session.defaultCredits} credits when they join via this link.
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mb-8">
        <Link
          href={`/admin/sessions/${sessionId}/voters`}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          View Voters
        </Link>
        <Link
          href={`/admin/sessions/${sessionId}/links`}
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Manage Individual Links
        </Link>
        <Link
          href={`/admin/sessions/${sessionId}/results`}
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          View Results
        </Link>
      </div>

      {/* Problems list */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Problems in this Session</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {session.problems
            .sort((a, b) => b.totalCredits - a.totalCredits)
            .map((problem, index) => (
              <div key={problem.id} className="p-4 flex items-center gap-4">
                <span className="text-lg font-bold text-gray-400 dark:text-gray-600 w-8">
                  #{index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">{problem.title}</p>
                  {problem.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {problem.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {problem.totalCredits} credits
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {problem.voterCount} voter{problem.voterCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
