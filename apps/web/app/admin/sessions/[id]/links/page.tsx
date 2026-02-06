"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { linksApi, sessionsApi } from "../../../_lib/api";
import type { VotingLink, VotingSession } from "../../../_lib/types";

export default function LinksManagementPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<VotingSession | null>(null);
  const [links, setLinks] = useState<VotingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Single link form
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState(10);
  const [creating, setCreating] = useState(false);

  // Bulk form
  const [bulkEmails, setBulkEmails] = useState("");
  const [bulkCredits, setBulkCredits] = useState(10);
  const [showBulk, setShowBulk] = useState(false);
  const [creatingBulk, setCreatingBulk] = useState(false);

  // Copy feedback
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [sessionId]);

  async function fetchData() {
    try {
      const [sessionData, linksData] = await Promise.all([
        sessionsApi.get(sessionId),
        linksApi.list(sessionId),
      ]);
      setSession(sessionData);
      setLinks(linksData);
      if (sessionData.config && typeof sessionData.config === "object" && "defaultCredits" in sessionData.config) {
        const defaultCredits = sessionData.config.defaultCredits as number;
        setCredits(defaultCredits);
        setBulkCredits(defaultCredits);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function createLink() {
    if (!email.trim()) return;
    setCreating(true);
    try {
      await linksApi.create(sessionId, { email: email.trim(), creditsAllowed: credits });
      setEmail("");
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create link");
    } finally {
      setCreating(false);
    }
  }

  async function createBulkLinks() {
    const emails = bulkEmails
      .split(/[\n,]/)
      .map((e) => e.trim())
      .filter((e) => e && e.includes("@"));

    if (emails.length === 0) {
      alert("Please enter valid email addresses");
      return;
    }

    setCreatingBulk(true);
    try {
      await linksApi.createBulk(
        sessionId,
        emails.map((email) => ({ email, creditsAllowed: bulkCredits }))
      );
      setBulkEmails("");
      setShowBulk(false);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create links");
    } finally {
      setCreatingBulk(false);
    }
  }

  function copyToClipboard(link: VotingLink) {
    const url = `${window.location.origin}${link.votingUrl}`;
    navigator.clipboard.writeText(url);
    setCopied(link.id);
    setTimeout(() => setCopied(null), 2000);
  }

  function copyAllLinks() {
    const urls = links
      .filter((l) => !l.usedAt)
      .map((l) => `${l.email}: ${window.location.origin}${l.votingUrl}`)
      .join("\n");
    navigator.clipboard.writeText(urls);
    alert("Copied all unused links to clipboard");
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

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const usedCount = links.filter((l) => l.usedAt).length;
  const unusedCount = links.length - usedCount;

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Voting Links
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {session?.title}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Links</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{links.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Used</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{usedCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Unused</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{unusedCount}</p>
        </div>
      </div>

      {/* Create link form */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Create Voting Link</h2>
          <button
            onClick={() => setShowBulk(!showBulk)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            {showBulk ? "Single link" : "Bulk create"}
          </button>
        </div>

        {!showBulk ? (
          <div className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voter@example.com"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              min="1"
              value={credits}
              onChange={(e) => setCredits(parseInt(e.target.value) || 10)}
              className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
            />
            <button
              onClick={createLink}
              disabled={creating || !email.trim()}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {creating ? "..." : "Create"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email addresses (one per line or comma-separated)
              </label>
              <textarea
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="ceo@company.com&#10;product@company.com&#10;engineer@company.com"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Credits per voter
                </label>
                <input
                  type="number"
                  min="1"
                  value={bulkCredits}
                  onChange={(e) => setBulkCredits(parseInt(e.target.value) || 10)}
                  className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
              </div>
              <button
                onClick={createBulkLinks}
                disabled={creatingBulk || !bulkEmails.trim()}
                className="mt-6 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {creatingBulk ? "Creating..." : "Create Links"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Links table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">All Links</h2>
          {unusedCount > 0 && (
            <button
              onClick={copyAllLinks}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Copy all unused
            </button>
          )}
        </div>

        {links.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No voting links created yet
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {links.map((link) => (
              <div key={link.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">{link.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {link.creditsAllowed} credits
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {link.usedAt ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      Used {new Date(link.usedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      Unused
                    </span>
                  )}
                  <button
                    onClick={() => copyToClipboard(link)}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {copied === link.id ? "Copied!" : "Copy link"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
