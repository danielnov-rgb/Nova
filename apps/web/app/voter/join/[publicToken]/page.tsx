"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { publicSessionApi } from "../../_lib/api";
import { isAuthenticated, getUser } from "../../_lib/auth";

interface PublicSessionInfo {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  status: string;
  defaultCredits: number;
  problemCount: number;
}

export default function JoinSessionPage() {
  const params = useParams();
  const router = useRouter();
  const publicToken = params.publicToken as string;

  const [session, setSession] = useState<PublicSessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    fetchSessionInfo();
  }, [publicToken]);

  async function fetchSessionInfo() {
    try {
      const data = await publicSessionApi.getByToken(publicToken);
      setSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Session not found");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    setJoining(true);
    setError(null);

    try {
      const result = await publicSessionApi.join(publicToken);
      // Redirect to the voting page
      router.push(`/voter/sessions/${result.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join session");
      setJoining(false);
    }
  }

  function formatDeadline(deadline: string | null) {
    if (!deadline) return null;
    const date = new Date(deadline);
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) return "Voting has ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ${hours} hour${hours > 1 ? "s" : ""} remaining`;
    }
    return `${hours} hour${hours > 1 ? "s" : ""} remaining`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Session Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const user = getUser();
  const deadlineText = formatDeadline(session.deadline);
  const isExpired = session.deadline && new Date(session.deadline) < new Date();
  const isNotActive = session.status !== "ACTIVE";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Nova Voting
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You&apos;ve been invited to participate
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
          {/* Session Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {session.title}
            </h2>
            {session.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {session.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{session.problemCount} problems to review</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{session.defaultCredits} credits to allocate</span>
              </div>
            </div>

            {deadlineText && (
              <div className={`mt-4 p-3 rounded-lg ${
                isExpired
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
              }`}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">{deadlineText}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Area */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {isNotActive ? (
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400">
                This voting session is not currently accepting votes.
              </p>
            </div>
          ) : isExpired ? (
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400">
                The deadline for this voting session has passed.
              </p>
            </div>
          ) : isLoggedIn ? (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Signed in as <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
              </p>
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full py-2.5 px-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors"
              >
                {joining ? "Joining..." : "Join & Start Voting"}
              </button>
              <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-500">
                Not you?{" "}
                <Link
                  href={`/voter/login?redirect=${encodeURIComponent(`/voter/join/${publicToken}`)}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Sign in with a different account
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Please sign in or create an account to participate
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={`/voter/login?redirect=${encodeURIComponent(`/voter/join/${publicToken}`)}`}
                  className="py-2.5 px-4 text-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href={`/voter/register?redirect=${encodeURIComponent(`/voter/join/${publicToken}`)}`}
                  className="py-2.5 px-4 text-center bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
