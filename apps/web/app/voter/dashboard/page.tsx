"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { voterSessionsApi, AssignedSession } from "../_lib/api";
import { isAuthenticated, getUser, clearAuth } from "../_lib/auth";
import { NovaLogo } from "../../_components/shared/NovaLogo";

// Check if user can access admin (anyone who is not just a VOTER)
function canAccessAdmin(user: { role: string } | null): boolean {
  if (!user) return false;
  return user.role !== "VOTER";
}

export default function VoterDashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<AssignedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/voter/login");
      return;
    }
    fetchSessions();
  }, [router]);

  async function fetchSessions() {
    try {
      const data = await voterSessionsApi.getAssigned();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearAuth();
    router.push("/voter/login");
  }

  // Categorize sessions
  const now = new Date();

  // Active: Not completed, status is ACTIVE, not expired
  const activeSessions = sessions.filter((s) => {
    if (s.completedAt) return false;
    if (s.status !== "ACTIVE") return false;
    if (s.deadline && new Date(s.deadline) < now) return false;
    return true;
  });

  // Completed: User has completed voting
  const completedSessions = sessions.filter((s) => s.completedAt);

  // Expired: Deadline passed or session closed without user completing
  const expiredSessions = sessions.filter((s) => {
    if (s.completedAt) return false;
    if (s.status === "CLOSED" || s.status === "ARCHIVED") return true;
    if (s.deadline && new Date(s.deadline) < now) return true;
    return false;
  });

  // Pending: Not active yet (DRAFT status)
  const pendingSessions = sessions.filter((s) => {
    if (s.completedAt) return false;
    if (s.status === "DRAFT") return true;
    return false;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header - matches admin layout style */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <NovaLogo size="sm" />

              {/* Navigation */}
              <nav className="flex items-center gap-1">
                {canAccessAdmin(user) && (
                  <Link
                    href="/admin/problems"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Problems
                  </Link>
                )}
                <Link
                  href="/voter/dashboard"
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 transition-colors"
                >
                  My Votes
                </Link>
              </nav>
            </div>

            {/* Right side - User info + Logout */}
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No voting sessions yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              When you&apos;re invited to vote, your sessions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Sessions - Requesting vote now */}
            {activeSessions.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Active ({activeSessions.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <SessionCard key={session.id} session={session} showVoteButton />
                  ))}
                </div>
              </section>
            )}

            {/* Pending Sessions - Not started yet */}
            {pendingSessions.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Upcoming ({pendingSessions.length})
                </h2>
                <div className="space-y-4">
                  {pendingSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Sessions - With View Results link */}
            {completedSessions.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Completed ({completedSessions.length})
                </h2>
                <div className="space-y-4">
                  {completedSessions.map((session) => (
                    <SessionCard key={session.id} session={session} showResultsLink />
                  ))}
                </div>
              </section>
            )}

            {/* Expired Sessions - Missed voting window */}
            {expiredSessions.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-4">
                  Expired ({expiredSessions.length})
                </h2>
                <div className="space-y-4">
                  {expiredSessions.map((session) => (
                    <SessionCard key={session.id} session={session} isExpired />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

interface SessionCardProps {
  session: AssignedSession;
  showVoteButton?: boolean;
  showResultsLink?: boolean;
  isExpired?: boolean;
}

function SessionCard({ session, showVoteButton, showResultsLink, isExpired: expired }: SessionCardProps) {
  const isCompleted = !!session.completedAt;
  const deadline = session.deadline ? new Date(session.deadline) : null;

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 transition-all ${
        expired
          ? "opacity-60"
          : isCompleted
          ? "opacity-85"
          : "hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {session.title}
            </h3>
            {isCompleted && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Voted
              </span>
            )}
            {expired && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                Missed
              </span>
            )}
          </div>

          {session.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {session.description}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {session.problemCount} problems
            </span>
            {!expired && (
              <span className="text-gray-500 dark:text-gray-400">
                {session.creditsUsed} / {session.creditsAllowed} credits used
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end ml-4 gap-2">
          {deadline && !isCompleted && !expired && (
            <DeadlineTimer deadline={deadline} />
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {showVoteButton && !isCompleted && (
              <Link
                href={`/voter/sessions/${session.sessionId}`}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Vote Now
              </Link>
            )}

            {showResultsLink && isCompleted && (
              <Link
                href={`/voter/sessions/${session.sessionId}/results`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Results
              </Link>
            )}

            {!showVoteButton && !showResultsLink && !expired && (
              <Link
                href={`/voter/sessions/${session.sessionId}`}
                className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DeadlineTimer({ deadline }: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    function updateTimer() {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Expired");
        setIsUrgent(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      // Urgent if less than 24 hours
      setIsUrgent(diff < 24 * 60 * 60 * 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    }

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div
      className={`text-xs px-2 py-1 rounded-full ${
        isUrgent
          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
      }`}
    >
      <div className="flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{timeLeft}</span>
      </div>
    </div>
  );
}
