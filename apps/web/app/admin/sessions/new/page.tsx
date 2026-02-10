"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sessionsApi, voterGroupsApi, sprintsApi, problemsApi } from "../../_lib/api";
import type { VoterGroup, Sprint, Problem } from "../../_lib/types";
import {
  DatePicker,
  SprintSelector,
  VoterSelector,
  AddProblemsModal,
  PreviewSection,
  type SelectedVoter,
  type RequiredField,
} from "./_components";

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
  const searchParams = useSearchParams();
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
  const [selectedVoters, setSelectedVoters] = useState<SelectedVoter[]>([]);
  const [requiredFields, setRequiredFields] = useState<RequiredField[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAddProblemsModal, setShowAddProblemsModal] = useState(false);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Pre-select problems from URL params
  useEffect(() => {
    const problemIds = searchParams.get("problemIds");
    if (problemIds) {
      setSelectedProblemIds(new Set(problemIds.split(",")));
    }
  }, [searchParams]);

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

  function removeProblem(id: string) {
    setSelectedProblemIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleAddProblems(ids: string[]) {
    setSelectedProblemIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }

  function handleSprintCreated(sprint: Sprint) {
    setSprints((prev) => [...prev, sprint]);
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
        sprintId: formData.sprintId || undefined,
        defaultCredits: formData.defaultCredits,
        // Store additional config (requiredFields will be saved in config JSON)
        config: requiredFields.length > 0 ? { requiredFields } : undefined,
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
  const hasPreselectedProblems = searchParams.get("problemIds") !== null;

  function formatDisplayDate(dateStr: string): string {
    if (!dateStr) return "Not set";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

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
            <button
              type="button"
              onClick={() => {
                if (s < step) setStep(s as Step);
              }}
              disabled={s > step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                s < step
                  ? "bg-primary-500 text-white cursor-pointer hover:bg-primary-600"
                  : s === step
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-2 border-primary-500"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              {s < step ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s
              )}
            </button>
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
          {step === 2 && "Voters & Requirements"}
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
                <DatePicker
                  value={formData.deadline}
                  onChange={(date) => setFormData({ ...formData, deadline: date })}
                  placeholder="Select deadline"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sprint (optional)
              </label>
              <SprintSelector
                sprints={sprints}
                value={formData.sprintId}
                onChange={(sprintId) => setFormData({ ...formData, sprintId })}
                onSprintCreated={handleSprintCreated}
              />
            </div>
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

      {/* Step 2: Voters */}
      {step === 2 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Voters & Requirements
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Add voters to this session and configure required information.
          </p>

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <VoterSelector
              voterGroups={voterGroups}
              selectedVoters={selectedVoters}
              requiredFields={requiredFields}
              onVotersChange={setSelectedVoters}
              onRequiredFieldsChange={setRequiredFields}
            />
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
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Problems ({selectedProblemIds.size} selected)
              </h2>
              {hasPreselectedProblems && (
                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                  Problems pre-selected from Problems page
                </p>
              )}
            </div>
            <button
              onClick={() => setShowAddProblemsModal(true)}
              className="px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add more
            </button>
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : selectedProblems.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No problems selected yet.</p>
              <button
                onClick={() => setShowAddProblemsModal(true)}
                className="text-primary-600 dark:text-primary-400 hover:underline text-sm mt-2"
              >
                Add problems
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search selected problems..."
                className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedProblems
                  .filter(
                    (p) =>
                      p.title.toLowerCase().includes(search.toLowerCase()) ||
                      p.description?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((problem) => (
                    <div
                      key={problem.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20"
                    >
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
                      <button
                        type="button"
                        onClick={() => removeProblem(problem.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove problem"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </>
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
            <PreviewSection title="Session Details" onEdit={() => setStep(1)}>
              <p className="font-medium text-gray-900 dark:text-white">{formData.title}</p>
              {formData.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {formData.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                <span>Deadline: {formatDisplayDate(formData.deadline)}</span>
                <span>Default credits: {formData.defaultCredits}</span>
                {formData.sprintId && (
                  <span>Sprint: {sprints.find((s) => s.id === formData.sprintId)?.name}</span>
                )}
              </div>
            </PreviewSection>

            <PreviewSection title={`Voters (${selectedVoters.length})`} onEdit={() => setStep(2)}>
              {selectedVoters.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No voters selected. Session will be open to all.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedVoters.slice(0, 8).map((voter) => (
                      <span
                        key={voter.id}
                        className="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {voter.name || voter.email}
                      </span>
                    ))}
                    {selectedVoters.length > 8 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        +{selectedVoters.length - 8} more
                      </span>
                    )}
                  </div>
                  {requiredFields.length > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Required info: {requiredFields.map((f) => f.label).join(", ")}
                    </p>
                  )}
                </>
              )}
            </PreviewSection>

            <PreviewSection title={`Selected Problems (${selectedProblems.length})`} onEdit={() => setStep(3)}>
              <div className="space-y-2 max-h-64 overflow-y-auto">
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
            </PreviewSection>
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

      {/* Add Problems Modal */}
      <AddProblemsModal
        isOpen={showAddProblemsModal}
        onClose={() => setShowAddProblemsModal(false)}
        problems={problems}
        selectedProblemIds={selectedProblemIds}
        onAddProblems={handleAddProblems}
      />
    </div>
  );
}
