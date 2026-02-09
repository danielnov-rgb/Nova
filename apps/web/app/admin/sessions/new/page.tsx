"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sessionsApi, problemsApi, voterGroupsApi, sprintsApi } from "../../_lib/api";
import type { Problem, VoterGroup, Sprint } from "../../_lib/types";

type Step = 1 | 2 | 3 | 4;

interface SessionFormData {
  title: string;
  description: string;
  deadline: string;
  defaultCredits: number;
  sprintId: string;
}

export default function CreateSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<SessionFormData>({
    title: "",
    description: "",
    deadline: "",
    defaultCredits: 10,
    sprintId: "",
  });
  const [problems, setProblems] = useState<Problem[]>([]);
  const [voterGroups, setVoterGroups] = useState<VoterGroup[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedProblemIds, setSelectedProblemIds] = useState<Set<string>>(new Set());
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [problemsData, groupsData, sprintsData] = await Promise.all([
        problemsApi.list(),
        voterGroupsApi.list(),
        sprintsApi.list(),
      ]);
      setProblems(problemsData);
      setVoterGroups(groupsData);
      setSprints(sprintsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoadingData(false);
    }
  }

  function toggleProblem(id: string) {
    setSelectedProblemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleGroup(id: string) {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectAllProblems() {
    setSelectedProblemIds(new Set(filteredProblems.map((p) => p.id)));
  }

  function selectNoProblems() {
    setSelectedProblemIds(new Set());
  }

  async function handleSubmit() {
    if (selectedProblemIds.size === 0) {
      setError("Please select at least one problem");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const session = await sessionsApi.create({
        title: formData.title,
        description: formData.description || undefined,
        deadline: formData.deadline || undefined,
        problemIds: Array.from(selectedProblemIds),
        voterGroupIds: selectedGroupIds.size > 0 ? Array.from(selectedGroupIds) : undefined,
        sprintId: formData.sprintId || undefined,
        config: { defaultCredits: formData.defaultCredits },
      });
      router.push(`/admin/sessions/${session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
      setLoading(false);
    }
  }

  const filteredProblems = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedProblems = problems.filter((p) => selectedProblemIds.has(p.id));
  const selectedGroups = voterGroups.filter((g) => selectedGroupIds.has(g.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/sessions"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to sessions
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Voting Session
        </h1>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s < step
                  ? "bg-primary-500 text-white"
                  : s === step
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-2 border-primary-500"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }`}
            >
              {s < step ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s
              )}
            </div>
            {s < 4 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  s < step ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
        <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
          {step === 1 && "Session Details"}
          {step === 2 && "Voter Groups"}
          {step === 3 && "Select Problems"}
          {step === 4 && "Review & Create"}
        </span>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Step 1: Session Details */}
      {step === 1 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Session Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="e.g., Q1 2026 Problem Priorities"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Instructions for voters..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Voting Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Credits per Voter
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.defaultCredits}
                  onChange={(e) => setFormData({ ...formData, defaultCredits: parseInt(e.target.value) || 10 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            {sprints.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sprint (optional)
                </label>
                <select
                  value={formData.sprintId}
                  onChange={(e) => setFormData({ ...formData, sprintId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">No sprint</option>
                  {sprints.map((sprint) => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                if (!formData.title.trim()) {
                  setError("Please enter a title");
                  return;
                }
                setError(null);
                setStep(2);
              }}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Voter Groups */}
      {step === 2 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Voter Groups
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Select which voter groups can participate. Leave empty to allow all users.
          </p>

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : voterGroups.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No voter groups created yet.</p>
              <Link
                href="/admin/groups/new"
                className="text-primary-600 dark:text-primary-400 hover:underline text-sm mt-2 inline-block"
              >
                Create a voter group
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {voterGroups.map((group) => (
                <label
                  key={group.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedGroupIds.has(group.id)
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedGroupIds.has(group.id)}
                    onChange={() => toggleGroup(group.id)}
                    className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {group.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        group.type === "LEADERSHIP"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : group.type === "PROJECT_TEAM"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}>
                        {group.type.replace("_", " ")}
                      </span>
                    </div>
                    {group.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {group.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {group._count?.memberships ?? 0} members • {group.defaultCredits} credits • {group.weight}x weight
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Problems */}
      {step === 3 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Problems ({selectedProblemIds.size} selected)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={selectAllProblems}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Select all
              </button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button
                onClick={selectNoProblems}
                className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredProblems.map((problem) => (
                <label
                  key={problem.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedProblemIds.has(problem.id)
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedProblemIds.has(problem.id)}
                    onChange={() => toggleProblem(problem.id)}
                    className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {problem.title}
                    </p>
                    {problem.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {problem.description}
                      </p>
                    )}
                    <div className="flex gap-1 mt-1">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (selectedProblemIds.size === 0) {
                  setError("Please select at least one problem");
                  return;
                }
                setError(null);
                setStep(4);
              }}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Create */}
      {step === 4 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Review & Create
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Session Details
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="font-medium text-gray-900 dark:text-white">{formData.title}</p>
                {formData.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formData.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {formData.deadline && (
                    <span>Deadline: {new Date(formData.deadline).toLocaleString()}</span>
                  )}
                  <span>Default credits: {formData.defaultCredits}</span>
                  {formData.sprintId && (
                    <span>Sprint: {sprints.find(s => s.id === formData.sprintId)?.name}</span>
                  )}
                </div>
              </div>
            </div>

            {selectedGroups.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Voter Groups ({selectedGroups.length})
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedGroups.map((group) => (
                      <span
                        key={group.id}
                        className={`text-sm px-3 py-1 rounded-full ${
                          group.type === "LEADERSHIP"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : group.type === "PROJECT_TEAM"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {group.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Selected Problems ({selectedProblems.length})
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                {selectedProblems.map((problem, i) => (
                  <div key={problem.id} className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 dark:text-gray-500 w-6">
                      {i + 1}.
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {problem.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Session"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
