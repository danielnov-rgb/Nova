"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sessionsApi } from "../_lib/api";
import { isAuthenticated } from "../_lib/auth";
import type { VotingSessionListItem, SessionStatus } from "../_lib/types";

const statusConfig: Record<SessionStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  ACTIVE: {
    label: "Active",
    className: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
};

export default function SessionsListPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<VotingSessionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SessionStatus | "ALL">("ALL");

  useEffect(() => {
    // Verify authentication before fetching
    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    fetchSessions();
  }, [router]);

  async function fetchSessions() {
    try {
      const data = await sessionsApi.list();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }

  const filteredSessions =
    filter === "ALL"
      ? sessions
      : sessions.filter((s) => s.status === filter);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchSessions();
            }}
            className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Voting Sessions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage problem prioritization sessions
          </p>
        </div>
        <Link
          href="/admin/sessions/new"
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          Create Session
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["ALL", "DRAFT", "ACTIVE", "CLOSED", "ARCHIVED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === status
                ? "bg-primary-500 text-white"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {status === "ALL" ? "All" : statusConfig[status].label}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            {sessions.length === 0
              ? "No voting sessions yet"
              : "No sessions match the selected filter"}
          </p>
          {sessions.length === 0 && (
            <Link
              href="/admin/sessions/new"
              className="inline-block mt-4 text-primary-600 dark:text-primary-400 hover:underline"
            >
              Create your first session
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <Link
              key={session.id}
              href={`/admin/sessions/${session.id}`}
              className="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {session.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        statusConfig[session.status].className
                      }`}
                    >
                      {statusConfig[session.status].label}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <span>{session.problemCount} problems</span>
                    <span>{session.voteCount} votes</span>
                    <span>{session.linkCount} invites</span>
                    {session.deadline && (
                      <span>
                        Deadline: {new Date(session.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-gray-400 dark:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
