"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sprintsApi } from "../../_lib/api";
import type { Sprint, SprintStatus, Problem } from "../../_lib/types";

const statusLabels: Record<SprintStatus, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

const statusColors: Record<SprintStatus, string> = {
  PLANNING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ARCHIVED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function SprintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [unassignedProblems, setUnassignedProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadSprint();
    loadUnassignedProblems();
  }, [id]);

  async function loadSprint() {
    try {
      setLoading(true);
      const data = await sprintsApi.get(id);
      setSprint(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sprint");
    } finally {
      setLoading(false);
    }
  }

  async function loadUnassignedProblems() {
    try {
      const data = await sprintsApi.getUnassignedProblems();
      setUnassignedProblems(data);
    } catch (err) {
      console.error("Failed to load unassigned problems:", err);
    }
  }

  async function handleStatusChange(newStatus: SprintStatus) {
    if (!sprint) return;
    setUpdating(true);
    try {
      await sprintsApi.update(id, { status: newStatus });
      setSprint({ ...sprint, status: newStatus });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  async function handleAssignProblems() {
    if (selectedProblems.length === 0) return;
    setAssigning(true);
    try {
      await sprintsApi.assignProblems(id, { problemIds: selectedProblems });
      setShowAssign(false);
      setSelectedProblems([]);
      loadSprint();
      loadUnassignedProblems();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to assign problems");
    } finally {
      setAssigning(false);
    }
  }

  async function handleUnassignProblem(problemId: string) {
    if (!confirm("Remove this problem from the sprint?")) return;
    try {
      await sprintsApi.unassignProblems(id, { problemIds: [problemId] });
      loadSprint();
      loadUnassignedProblems();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to unassign problem");
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !sprint) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">{error || "Sprint not found"}</p>
          <Link href="/admin/sprints" className="mt-2 text-sm text-red-600 dark:text-red-400 underline">
            Back to Sprints
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/sprints"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Sprints
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {sprint.name}
              </h1>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[sprint.status]}`}>
                {statusLabels[sprint.status]}
              </span>
            </div>
            {sprint.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {sprint.description}
              </p>
            )}
            {sprint.startDate && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {new Date(sprint.startDate).toLocaleDateString()}
                {sprint.endDate && ` - ${new Date(sprint.endDate).toLocaleDateString()}`}
              </p>
            )}
          </div>
          <div>
            <select
              value={sprint.status}
              onChange={(e) => handleStatusChange(e.target.value as SprintStatus)}
              disabled={updating}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sprint.problems?.length ?? 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Problems</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sprint.votingSessions?.length ?? 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Voting Sessions</p>
        </div>
      </div>

      {/* Problems Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Problems in this Sprint</h2>
          <button
            onClick={() => setShowAssign(true)}
            className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg font-medium transition-colors"
          >
            Add Problems
          </button>
        </div>

        {showAssign && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select problems to add ({selectedProblems.length} selected)
            </h3>
            {unassignedProblems.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                All problems are already assigned to sprints
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                {unassignedProblems.map((problem) => (
                  <label
                    key={problem.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProblems.includes(problem.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProblems([...selectedProblems, problem.id]);
                        } else {
                          setSelectedProblems(selectedProblems.filter((id) => id !== problem.id));
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">{problem.title}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowAssign(false);
                  setSelectedProblems([]);
                }}
                className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignProblems}
                disabled={assigning || selectedProblems.length === 0}
                className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white text-sm rounded-lg font-medium transition-colors"
              >
                {assigning ? "Adding..." : `Add ${selectedProblems.length} Problem${selectedProblems.length !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        )}

        {!sprint.problems || sprint.problems.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 dark:text-gray-500">No problems assigned yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
              Add problems to this sprint to organize your work
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {sprint.problems.map((problem) => (
              <div key={problem.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {problem.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {problem.status}
                    </span>
                    {problem.tags?.length > 0 && (
                      <div className="flex gap-1">
                        {problem.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500 dark:text-gray-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleUnassignProblem(problem.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Remove from sprint"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voting Sessions Section */}
      {sprint.votingSessions && sprint.votingSessions.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Voting Sessions</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {sprint.votingSessions.map((session) => (
              <Link
                key={session.id}
                href={`/admin/sessions/${session.id}`}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {session.status} • Created {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
