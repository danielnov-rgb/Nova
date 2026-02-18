"use client";

import { useEffect, useState } from "react";
import { sessionsApi, SessionVoter, SessionVotersResponse } from "../../../_lib/api";

interface VoterStatusPanelProps {
  sessionId: string;
}

type VoterStatus = "invited" | "viewed" | "in_progress" | "completed";

function getVoterStatus(voter: SessionVoter): VoterStatus {
  if (voter.completedAt) return "completed";
  if (voter.voteCount > 0) return "in_progress";
  if (voter.openedAt) return "viewed";
  return "invited";
}

const statusConfig: Record<VoterStatus, { label: string; className: string; icon: string }> = {
  invited: {
    label: "Invited",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    icon: "📧",
  },
  viewed: {
    label: "Viewed",
    className: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    icon: "👀",
  },
  in_progress: {
    label: "Voting",
    className: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: "✍️",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    icon: "✓",
  },
};

export function VoterStatusPanel({ sessionId }: VoterStatusPanelProps) {
  const [data, setData] = useState<SessionVotersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchVoters();
  }, [sessionId]);

  async function fetchVoters() {
    try {
      const response = await sessionsApi.getVoters(sessionId);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load voters");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading voter status...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-8">
        <p className="text-red-600 dark:text-red-400">{error || "Failed to load voters"}</p>
      </div>
    );
  }

  const { summary, voters } = data;

  // Calculate additional stats
  const inProgressCount = voters.filter(v => getVoterStatus(v) === "in_progress").length;
  const viewedOnlyCount = voters.filter(v => getVoterStatus(v) === "viewed").length;
  const notStartedCount = summary.totalVoters - summary.openedCount;

  // Group voters by status
  const votersByStatus = {
    completed: voters.filter(v => getVoterStatus(v) === "completed"),
    in_progress: voters.filter(v => getVoterStatus(v) === "in_progress"),
    viewed: voters.filter(v => getVoterStatus(v) === "viewed"),
    invited: voters.filter(v => getVoterStatus(v) === "invited"),
  };

  const completionRate = summary.totalVoters > 0
    ? Math.round((summary.completedCount / summary.totalVoters) * 100)
    : 0;

  // Empty state
  if (summary.totalVoters === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Voter Status</h3>
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-1">No voters yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Add voter groups to this session or enable the public link to invite voters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 overflow-hidden">
      {/* Header with summary */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Voter Status
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({summary.totalVoters} {summary.totalVoters === 1 ? "voter" : "voters"})
              </span>
            </h3>
            {summary.totalVoters > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {[
                  summary.groupVoters > 0 && `${summary.groupVoters} from groups`,
                  summary.publicVoters > 0 && `${summary.publicVoters} via public link`,
                  summary.linkVoters > 0 && `${summary.linkVoters} via invite links`,
                ].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            {expanded ? "Hide details" : "Show all voters"}
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Completion</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {summary.completedCount} / {summary.totalVoters} ({completionRate}%)
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${summary.totalVoters > 0 ? (summary.completedCount / summary.totalVoters) * 100 : 0}%` }}
              />
              <div
                className="bg-yellow-500 transition-all duration-500"
                style={{ width: `${summary.totalVoters > 0 ? (inProgressCount / summary.totalVoters) * 100 : 0}%` }}
              />
              <div
                className="bg-blue-500 transition-all duration-500"
                style={{ width: `${summary.totalVoters > 0 ? (viewedOnlyCount / summary.totalVoters) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status summary pills */}
        <div className="flex flex-wrap gap-2">
          <StatusPill
            status="completed"
            count={summary.completedCount}
            total={summary.totalVoters}
          />
          <StatusPill
            status="in_progress"
            count={inProgressCount}
            total={summary.totalVoters}
          />
          <StatusPill
            status="viewed"
            count={viewedOnlyCount}
            total={summary.totalVoters}
          />
          <StatusPill
            status="invited"
            count={notStartedCount}
            total={summary.totalVoters}
          />
        </div>
      </div>

      {/* Expanded voter list */}
      {expanded && (
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(votersByStatus).map(([status, statusVoters]) => {
            if (statusVoters.length === 0) return null;
            const config = statusConfig[status as VoterStatus];

            return (
              <div key={status}>
                <div className="px-5 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {config.icon} {config.label} ({statusVoters.length})
                  </span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {statusVoters.map((voter) => (
                    <VoterRow key={voter.id} voter={voter} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer with nudge action (future feature) */}
      {notStartedCount > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
          <button
            disabled
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm cursor-not-allowed flex items-center justify-center gap-2"
            title="Coming soon"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Nudge {notStartedCount} {notStartedCount === 1 ? "voter" : "voters"} who haven't started
            <span className="text-xs">(Coming soon)</span>
          </button>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, count, total }: { status: VoterStatus; count: number; total: number }) {
  const config = statusConfig[status];
  if (count === 0) return null;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.icon} {count} {config.label.toLowerCase()}
    </span>
  );
}

function VoterRow({ voter }: { voter: SessionVoter }) {
  const status = getVoterStatus(voter);
  const config = statusConfig[status];

  const displayName = voter.name || voter.email.split("@")[0] || voter.email;

  return (
    <div className="px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {displayName}
            </p>
            {voter.type === "group" && voter.groupName && (
              <span className="px-1.5 py-0.5 text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
                {voter.groupName}
              </span>
            )}
            {voter.type === "link" && (
              <span className="px-1.5 py-0.5 text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded">
                Link invite
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {voter.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Vote progress */}
        {voter.voteCount > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {voter.creditsUsed}/{voter.creditsAllowed} credits
          </span>
        )}

        {/* Status badge */}
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
          {config.label}
        </span>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 dark:text-gray-500 min-w-[60px] text-right">
          {voter.completedAt
            ? formatRelativeTime(voter.completedAt)
            : voter.openedAt
            ? formatRelativeTime(voter.openedAt)
            : "—"
          }
        </span>
      </div>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
