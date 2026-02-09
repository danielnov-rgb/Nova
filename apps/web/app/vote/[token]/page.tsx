"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { publicSessionApi } from "../../voter/_lib/api";
import { isAuthenticated, getToken } from "../../voter/_lib/auth";

interface PublicSessionInfo {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  status: string;
  tenantName?: string;
  problemCount: number;
  defaultCredits: number;
}

export default function PublicVotePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [sessionInfo, setSessionInfo] = useState<PublicSessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (token) {
      fetchSessionInfo();
    }
  }, [token]);

  async function fetchSessionInfo() {
    try {
      const data = await publicSessionApi.getByToken(token);
      setSessionInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid voting link");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinSession() {
    if (!isAuthenticated()) {
      // Redirect to login with return URL
      router.push(`/voter/login?redirect=${encodeURIComponent(`/vote/${token}`)}`);
      return;
    }

    setJoining(true);
    setError(null);

    try {
      const result = await publicSessionApi.join(token);
      // Redirect to the voter session page
      router.push(`/voter/sessions/${result.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join session");
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading voting session...</p>
        </div>
      </div>
    );
  }

  if (error && !sessionInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Invalid Voting Link</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!sessionInfo) return null;

  const deadline = sessionInfo.deadline ? new Date(sessionInfo.deadline) : null;
  const isExpired = deadline && deadline < new Date();
  const isActive = sessionInfo.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {sessionInfo.title}
            </h1>
            {sessionInfo.tenantName && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hosted by {sessionInfo.tenantName}
              </p>
            )}
          </div>

          {/* Description */}
          {sessionInfo.description && (
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {sessionInfo.description}
            </p>
          )}

          {/* Session Info */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Problems to vote on</span>
              <span className="font-medium text-gray-900 dark:text-white">{sessionInfo.problemCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Credits you'll receive</span>
              <span className="font-medium text-gray-900 dark:text-white">{sessionInfo.defaultCredits}</span>
            </div>
            {deadline && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Deadline</span>
                <span className={`font-medium ${isExpired ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                  {deadline.toLocaleDateString()} at {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                isExpired ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {isExpired ? 'Expired' : sessionInfo.status}
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Action button */}
          {isActive && !isExpired ? (
            <button
              onClick={handleJoinSession}
              disabled={joining}
              className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors"
            >
              {joining ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Joining...
                </span>
              ) : isAuthenticated() ? (
                "Join & Start Voting"
              ) : (
                "Login to Vote"
              )}
            </button>
          ) : (
            <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <p className="text-gray-600 dark:text-gray-400">
                {isExpired ? "This voting session has ended." : "This voting session is not currently active."}
              </p>
            </div>
          )}

          {/* Already have an account hint */}
          {!isAuthenticated() && isActive && !isExpired && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Don't have an account?{" "}
              <Link
                href={`/voter/register?redirect=${encodeURIComponent(`/vote/${token}`)}`}
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                Register here
              </Link>
            </p>
          )}
        </div>

        {/* Nova Platform Introduction Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
              Powered by
            </p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Nova Product Intelligence Platform
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
              Nova doesn't just help you prioritize what to build. It helps you build it faster,
              measure it properly, and improve it continuously through AI that gets smarter with every project.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm"
            >
              Explore the full platform
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
