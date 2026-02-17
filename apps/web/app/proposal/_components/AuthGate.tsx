"use client";

import { useState, useEffect, type ReactNode } from "react";
import { identifyUser, trackEvent } from "../_lib/posthog";

const PROPOSAL_PASSWORD = process.env.NEXT_PUBLIC_PROPOSAL_PASSWORD || "nova2025";

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("proposal_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          identifyUser(parsed.name);
          setAuthenticated(true);
        }
      } catch {
        // ignore invalid storage
      }
    }
    setLoading(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (password !== PROPOSAL_PASSWORD) {
      setError("Invalid password");
      return;
    }

    sessionStorage.setItem("proposal_auth", JSON.stringify({ name: name.trim(), timestamp: Date.now() }));
    identifyUser(name.trim());
    trackEvent("proposal_viewed", { name: name.trim() });
    setAuthenticated(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300 mb-6 backdrop-blur-sm">
            <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Confidential Proposal
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">Nova</span>
          </h1>
          <p className="text-gray-400">Enter your credentials to view this proposal</p>
        </div>

        {/* Login form */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 backdrop-blur-sm">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-800">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-cyan-500 hover:from-primary-400 hover:to-cyan-400 text-white font-medium rounded-lg transition-all"
            >
              View Proposal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
