"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { solutionsApi, Solution, SolutionStatus } from "../_lib/api";
import { AgentPageHeader } from "../_components/AgentPageHeader";

const STATUS_LABELS: Record<SolutionStatus, string> = {
  DESIGNED: "Designed",
  DEVELOPMENT: "In Development",
  TESTING: "Testing",
  LIVE: "Live",
  KILLED: "Killed",
};

const STATUS_COLORS: Record<SolutionStatus, string> = {
  DESIGNED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  DEVELOPMENT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  TESTING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  LIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  KILLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<SolutionStatus | "">("");

  useEffect(() => {
    fetchSolutions();
  }, [filterStatus]);

  async function fetchSolutions() {
    try {
      setLoading(true);
      const data = await solutionsApi.list(filterStatus || undefined);
      setSolutions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load solutions");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this solution?")) return;

    try {
      await solutionsApi.delete(id);
      setSolutions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete solution");
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
        <AgentPageHeader agentId="solution" />
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Solution Design
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Design and track solutions for prioritized problems
            </p>
          </div>
          <Link
            href="/admin/solutions/new"
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            New Solution
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === ""
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            {(Object.keys(STATUS_LABELS) as SolutionStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>

        {/* Solutions Grid */}
        {solutions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <LightbulbIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No solutions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start designing solutions for your prioritized problems
            </p>
            <Link
              href="/admin/solutions/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Create Your First Solution
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                onDelete={() => handleDelete(solution.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SolutionCard({
  solution,
  onDelete,
}: {
  solution: Solution;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            STATUS_COLORS[solution.status]
          }`}
        >
          {STATUS_LABELS[solution.status]}
        </span>
        <div className="flex gap-1">
          <Link
            href={`/admin/solutions/${solution.id}`}
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

      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {solution.title}
      </h3>

      {solution.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {solution.description}
        </p>
      )}

      {solution.problem && (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Solving: <span className="font-medium">{solution.problem.title}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// Icons
function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
