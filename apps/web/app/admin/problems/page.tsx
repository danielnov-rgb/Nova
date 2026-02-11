'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  EnhancedProblem,
  ProblemGroup,
  ProblemStatus,
  ProblemSource,
  WeightValues,
  DEFAULT_WEIGHTS,
  DEFAULT_SCORES,
} from '../_lib/types/problem';
import {
  sampleWeightingProfiles,
} from './_data/sample-problems';
import { problemsApi, problemGroupsApi, ProblemGroup as ApiProblemGroup } from '../_lib/api';
import type { Problem as ApiProblem } from '../_lib/types';

// Storage keys for persistence
const VIEW_MODE_KEY = 'nova-problems-view-mode';

// Helper to extract score value from API response (handles both number and object formats)
function extractScore(score: unknown): { value: number; justification?: string; source?: string } {
  if (typeof score === 'number') {
    return { value: score };
  }
  if (score && typeof score === 'object' && 'value' in score) {
    return score as { value: number; justification?: string; source?: string };
  }
  return { value: 0 };
}

// Transform API Problem to EnhancedProblem
function transformApiProblem(apiProblem: ApiProblem): EnhancedProblem {
  const scores = apiProblem.scores || {};
  return {
    id: apiProblem.id,
    tenantId: 'demo-tenant',
    title: apiProblem.title,
    description: apiProblem.description || '',
    hypothesis: apiProblem.hypothesis,
    source: (apiProblem.source as ProblemSource) || 'MANUAL',
    evidenceItems: apiProblem.evidenceItems || [],
    evidenceSummary: apiProblem.evidenceSummary,
    status: (apiProblem.status as ProblemStatus) || 'DISCOVERED',
    isShortlisted: false,
    tags: apiProblem.tags || [],
    groupIds: apiProblem.groupIds || [],
    createdAt: apiProblem.createdAt,
    updatedAt: apiProblem.createdAt,
    priorityScore: apiProblem.priorityScore,
    scores: {
      applicability: extractScore(scores.applicability),
      severity: extractScore(scores.severity),
      frequency: extractScore(scores.frequency),
      willingnessToPay: extractScore(scores.willingnessToPay || scores.willingness_to_pay),
      retentionImpact: extractScore(scores.retentionImpact || scores.retention_impact),
      acquisitionPotential: extractScore(scores.acquisitionPotential || scores.acquisition_potential),
      viralCoefficient: extractScore(scores.viralCoefficient || scores.viral_coefficient),
      strategicFit: extractScore(scores.strategicFit || scores.strategic_fit),
      feasibility: extractScore(scores.feasibility),
      timeToValue: extractScore(scores.timeToValue || scores.time_to_value),
      riskLevel: extractScore(scores.riskLevel || scores.risk_level),
    },
  };
}

// Transform API ProblemGroup to frontend ProblemGroup
function transformApiGroup(apiGroup: ApiProblemGroup): ProblemGroup {
  return {
    id: apiGroup.id,
    tenantId: apiGroup.tenantId,
    name: apiGroup.name,
    description: apiGroup.description,
    color: apiGroup.color || '#6366f1',
    icon: apiGroup.icon || 'folder',
    problemCount: apiGroup._count?.problems || 0,
    createdAt: apiGroup.createdAt,
    updatedAt: apiGroup.updatedAt,
  };
}

// Components
import { GroupTabs } from './_components/GroupTabs';
import { BulkActionBar } from './_components/BulkActionBar';
import { ViewToggle, ViewMode } from './_components/ViewToggle';
import { WeightingSliders } from './_components/WeightingSliders';
import { StatusFilter } from './_components/StatusFilter';
import { GroupManager } from './_components/GroupManager';
import { ProblemCard } from './_components/ProblemCard';
import { ProblemListItem } from './_components/ProblemListItem';
import { KanbanBoard } from './_components/KanbanBoard';

// Calculate priority score with only enabled attributes
function calculatePriorityWithEnabled(
  scores: EnhancedProblem['scores'],
  weights: WeightValues,
  enabledAttributes: Set<keyof WeightValues>
): number {
  if (enabledAttributes.size === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  for (const key of enabledAttributes) {
    const scoreObj = scores[key];
    const value = scoreObj?.value ?? 0;
    const weight = weights[key];
    weightedSum += value * weight;
    totalWeight += weight;
  }

  // Normalize to percentage of max possible (100 * totalWeight)
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export default function ProblemsPage() {
  const router = useRouter();

  // Data state - fetched from API
  const [problems, setProblems] = useState<EnhancedProblem[]>([]);
  const [groups, setGroups] = useState<ProblemGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingGroups, setSavingGroups] = useState(false);

  // Load problems and groups from API
  useEffect(() => {
    async function loadData() {
      try {
        const [apiProblems, apiGroups] = await Promise.all([
          problemsApi.list(),
          problemGroupsApi.list(),
        ]);
        setProblems(apiProblems.map(transformApiProblem));
        setGroups(apiGroups.map(transformApiGroup));
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load problems');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // View & Filter state - persist viewMode to localStorage
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VIEW_MODE_KEY);
      if (saved === 'list' || saved === 'card' || saved === 'board') {
        return saved;
      }
    }
    return 'list';
  });

  // Persist viewMode changes
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(VIEW_MODE_KEY, mode);
    }
  }, []);
  const [activeGroupId, setActiveGroupId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<ProblemStatus>>(new Set());

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Weighting state
  const [weights, setWeights] = useState<WeightValues>(DEFAULT_WEIGHTS);
  const [enabledAttributes, setEnabledAttributes] = useState<Set<keyof WeightValues>>(
    new Set(['severity', 'applicability', 'willingnessToPay', 'feasibility'])
  );
  const [weightsExpanded, setWeightsExpanded] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState('wp-default');

  // Modal state
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProblemGroup | null>(null);

  // Load selected profile weights
  useEffect(() => {
    const profile = sampleWeightingProfiles.find((p) => p.id === selectedProfileId);
    if (profile) {
      setWeights(profile.weights);
    }
  }, [selectedProfileId]);

  // Calculate priority scores and filter problems
  const processedProblems = useMemo(() => {
    let filtered = problems.map((problem) => ({
      ...problem,
      priorityScore: calculatePriorityWithEnabled(problem.scores, weights, enabledAttributes),
    }));

    // Filter by group
    if (activeGroupId !== 'all') {
      filtered = filtered.filter((p) => p.groupIds.includes(activeGroupId));
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Filter by status (if any selected)
    if (statusFilter.size > 0) {
      filtered = filtered.filter((p) => statusFilter.has(p.status));
    }

    // Sort by priority score (descending)
    filtered.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

    return filtered;
  }, [problems, weights, enabledAttributes, activeGroupId, searchQuery, statusFilter]);

  // Selection handlers
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  // Select all visible problems
  function selectAll() {
    setSelectedIds(new Set(processedProblems.map((p) => p.id)));
  }

  // Unselect all
  function unselectAll() {
    setSelectedIds(new Set());
  }

  // Attribute toggle handler
  function handleToggleAttribute(key: keyof WeightValues) {
    setEnabledAttributes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  // Group handlers - persist to API
  async function handleAddToGroups(groupIds: string[]) {
    if (selectedIds.size === 0 || groupIds.length === 0) return;

    setSavingGroups(true);
    try {
      await problemGroupsApi.bulkAdd({
        problemIds: Array.from(selectedIds),
        groupIds,
      });

      // Update local state
      setProblems((prev) =>
        prev.map((problem) => {
          if (selectedIds.has(problem.id)) {
            const newGroupIds = new Set([...problem.groupIds, ...groupIds]);
            return { ...problem, groupIds: Array.from(newGroupIds) };
          }
          return problem;
        })
      );
      clearSelection();
    } catch (err) {
      console.error('Failed to add to groups:', err);
      setError('Failed to add problems to groups');
    } finally {
      setSavingGroups(false);
    }
  }

  async function handleRemoveFromGroups(groupIds: string[]) {
    if (selectedIds.size === 0 || groupIds.length === 0) return;

    setSavingGroups(true);
    try {
      await problemGroupsApi.bulkRemove({
        problemIds: Array.from(selectedIds),
        groupIds,
      });

      // Update local state
      setProblems((prev) =>
        prev.map((problem) => {
          if (selectedIds.has(problem.id)) {
            return {
              ...problem,
              groupIds: problem.groupIds.filter((id) => !groupIds.includes(id)),
            };
          }
          return problem;
        })
      );
      clearSelection();
    } catch (err) {
      console.error('Failed to remove from groups:', err);
      setError('Failed to remove problems from groups');
    } finally {
      setSavingGroups(false);
    }
  }

  // Status change handler (bulk) - persists to API
  async function handleChangeStatus(status: ProblemStatus) {
    const problemIds = Array.from(selectedIds);
    if (problemIds.length === 0) return;

    // Optimistically update local state
    setProblems((prev) =>
      prev.map((problem) => {
        if (selectedIds.has(problem.id)) {
          return { ...problem, status };
        }
        return problem;
      })
    );
    clearSelection();

    // Persist to API (fire and forget with error handling)
    try {
      await Promise.all(
        problemIds.map((id) => problemsApi.update(id, { status }))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update problem status');
      // Could revert state here if needed
    }
  }

  // Single problem status change (for Kanban drag-and-drop) - persists to API
  async function handleSingleStatusChange(problemId: string, status: ProblemStatus) {
    // Optimistically update local state for snappy UI
    setProblems((prev) =>
      prev.map((problem) => {
        if (problem.id === problemId) {
          return { ...problem, status };
        }
        return problem;
      })
    );

    // Persist to API
    try {
      await problemsApi.update(problemId, { status });
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update problem status');
      // Revert the optimistic update on error
      const apiProblems = await problemsApi.list();
      setProblems(apiProblems.map(transformApiProblem));
    }
  }

  function handleCreateSession() {
    const problemIdsParam = Array.from(selectedIds).join(',');
    router.push(`/admin/sessions/new?problemIds=${problemIdsParam}`);
  }

  async function handleSaveGroup(groupData: Partial<ProblemGroup>) {
    try {
      if (groupData.id) {
        // Update existing
        const updated = await problemGroupsApi.update(groupData.id, {
          name: groupData.name,
          description: groupData.description,
          color: groupData.color,
          icon: groupData.icon,
        });
        setGroups((prev) =>
          prev.map((g) => (g.id === groupData.id ? transformApiGroup(updated) : g))
        );
      } else {
        // Create new
        const created = await problemGroupsApi.create({
          name: groupData.name || 'New Group',
          description: groupData.description,
          color: groupData.color || '#6366f1',
          icon: groupData.icon,
        });
        setGroups((prev) => [...prev, transformApiGroup(created)]);
      }
    } catch (err) {
      console.error('Failed to save group:', err);
      setError('Failed to save group');
    }
  }

  async function handleDeleteGroup(groupId: string) {
    try {
      await problemGroupsApi.delete(groupId);
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      // Remove group from all problems locally
      setProblems((prev) =>
        prev.map((p) => ({
          ...p,
          groupIds: p.groupIds.filter((id) => id !== groupId),
        }))
      );
      if (activeGroupId === groupId) {
        setActiveGroupId('all');
      }
    } catch (err) {
      console.error('Failed to delete group:', err);
      setError('Failed to delete group');
    }
  }

  function openEditGroup(group: ProblemGroup) {
    setEditingGroup(group);
    setShowGroupManager(true);
  }

  function openCreateGroup() {
    setEditingGroup(null);
    setShowGroupManager(true);
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Problem Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize, prioritize, and group problems for voting sessions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/import"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Import CSV
            </Link>
            <Link
              href="/admin/problems/new"
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Add Problem
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mb-6 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Loading problems...</p>
          </div>
        )}

        {/* Group Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-t-xl border border-b-0 border-gray-200 dark:border-gray-800">
          <GroupTabs
            groups={groups}
            problems={problems}
            activeGroupId={activeGroupId}
            onSelectGroup={setActiveGroupId}
            onCreateGroup={openCreateGroup}
          />
        </div>

        {/* Filters & View Toggle */}
        <div className="bg-white dark:bg-gray-900 border-x border-gray-200 dark:border-gray-800 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-3 flex-wrap">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter (Multi-select) */}
              <StatusFilter
                selectedStatuses={statusFilter}
                onChange={setStatusFilter}
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Weighting Profile */}
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                {sampleWeightingProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>

              {/* Weights Toggle */}
              <button
                onClick={() => setWeightsExpanded(!weightsExpanded)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  weightsExpanded
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-primary-500 bg-primary-500 hover:bg-primary-600 text-white'
                }`}
                title="Adjust weights"
              >
                <SlidersIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Weights</span>
              </button>

              {/* View Toggle */}
              <ViewToggle viewMode={viewMode} onChange={handleViewModeChange} />
            </div>
          </div>
        </div>

        {/* Weighting Sliders (Collapsible) */}
        {weightsExpanded && (
          <div className="border-x border-gray-200 dark:border-gray-800">
            <WeightingSliders
              weights={weights}
              enabledAttributes={enabledAttributes}
              onChange={setWeights}
              onToggleAttribute={handleToggleAttribute}
              collapsed={false}
              onToggleCollapse={() => setWeightsExpanded(false)}
            />
          </div>
        )}

        {/* Selection Controls */}
        <div className="border-x border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedIds.size > 0
                ? `${selectedIds.size} of ${processedProblems.length} selected`
                : `${processedProblems.length} problems`}
            </span>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={selectAll}
                disabled={processedProblems.length === 0}
                className="text-xs px-2 py-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Select All
              </button>
              {selectedIds.size > 0 && (
                <button
                  onClick={unselectAll}
                  className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  Unselect All
                </button>
              )}
            </div>
          </div>
          {savingGroups && (
            <span className="text-xs text-gray-500 dark:text-gray-400">Saving...</span>
          )}
        </div>

        {/* Selection Action Bar */}
        {selectedIds.size > 0 && (
          <div className="border-x border-gray-200 dark:border-gray-800 px-4 pb-4">
            <BulkActionBar
              selectedCount={selectedIds.size}
              groups={groups}
              onAddToGroups={handleAddToGroups}
              onRemoveFromGroups={handleRemoveFromGroups}
              onChangeStatus={handleChangeStatus}
              onCreateSession={handleCreateSession}
              onClearSelection={clearSelection}
            />
          </div>
        )}

        {/* Problems List/Grid/Board */}
        <div className={`bg-white dark:bg-gray-900 rounded-b-xl border border-t-0 border-gray-200 dark:border-gray-800 ${viewMode === 'board' ? 'overflow-x-auto' : 'overflow-hidden'}`}>
          {processedProblems.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
              {problems.length === 0 ? (
                <div>
                  <p className="mb-2">No problems discovered yet</p>
                  <Link
                    href="/admin/import"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Import problems from CSV
                  </Link>
                </div>
              ) : (
                'No problems match your filters'
              )}
            </div>
          ) : viewMode === 'list' ? (
            // List View
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {processedProblems.map((problem) => (
                <ProblemListItem
                  key={problem.id}
                  problem={problem}
                  priorityScore={problem.priorityScore || 0}
                  groups={groups}
                  selected={selectedIds.has(problem.id)}
                  onSelect={() => toggleSelect(problem.id)}
                  onViewDetails={() => router.push(`/admin/problems/${problem.id}`)}
                />
              ))}
            </div>
          ) : viewMode === 'card' ? (
            // Card View
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processedProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  priorityScore={problem.priorityScore || 0}
                  groups={groups}
                  selected={selectedIds.has(problem.id)}
                  onSelect={() => toggleSelect(problem.id)}
                  onViewDetails={() => router.push(`/admin/problems/${problem.id}`)}
                />
              ))}
            </div>
          ) : (
            // Kanban Board View
            <KanbanBoard
              problems={processedProblems}
              groups={groups}
              onStatusChange={handleSingleStatusChange}
              onViewDetails={(problemId) => router.push(`/admin/problems/${problemId}`)}
            />
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {processedProblems.length} of {problems.length} problems
          </span>
          {activeGroupId !== 'all' && (
            <button
              onClick={() => openEditGroup(groups.find((g) => g.id === activeGroupId)!)}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Edit "{groups.find((g) => g.id === activeGroupId)?.name}" group
            </button>
          )}
        </div>
      </div>

      {/* Group Manager Modal */}
      <GroupManager
        isOpen={showGroupManager}
        onClose={() => {
          setShowGroupManager(false);
          setEditingGroup(null);
        }}
        group={editingGroup}
        onSave={handleSaveGroup}
        onDelete={handleDeleteGroup}
      />
    </div>
  );
}

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    </svg>
  );
}
