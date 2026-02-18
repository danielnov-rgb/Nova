"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { competitorsApi, Competitor } from "../_lib/api";
import { AgentPageHeader } from "../_components/AgentPageHeader";

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  async function fetchCompetitors() {
    try {
      const data = await competitorsApi.list();
      setCompetitors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load competitors");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this competitor?")) return;

    try {
      await competitorsApi.delete(id);
      setCompetitors((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete competitor");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AgentPageHeader agentId="research" />
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Competitor Research
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track competitors, their solutions, and market positioning
            </p>
          </div>
          <Link
            href="/admin/competitors/new"
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            Add Competitor
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Competitors Grid */}
        {competitors.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <BuildingIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No competitors tracked yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start mapping your competitive landscape
            </p>
            <Link
              href="/admin/competitors/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Competitor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitors.map((competitor) => (
              <CompetitorCard
                key={competitor.id}
                competitor={competitor}
                onDelete={() => handleDelete(competitor.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CompetitorCard({
  competitor,
  onDelete,
}: {
  competitor: Competitor;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
              {competitor.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {competitor.name}
            </h3>
            {competitor.website && (
              <a
                href={competitor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline"
              >
                {competitor.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Link
            href={`/admin/competitors/${competitor.id}`}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <EditIcon className="w-4 h-4" />
          </Link>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {competitor.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {competitor.description}
        </p>
      )}

      <div className="space-y-3">
        {competitor.strengths.length > 0 && (
          <div>
            <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
              Strengths
            </div>
            <div className="flex flex-wrap gap-1">
              {competitor.strengths.slice(0, 2).map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded"
                >
                  {s}
                </span>
              ))}
              {competitor.strengths.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{competitor.strengths.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {competitor.weaknesses.length > 0 && (
          <div>
            <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
              Weaknesses
            </div>
            <div className="flex flex-wrap gap-1">
              {competitor.weaknesses.slice(0, 2).map((w, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded"
                >
                  {w}
                </span>
              ))}
              {competitor.weaknesses.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{competitor.weaknesses.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Icons
function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
