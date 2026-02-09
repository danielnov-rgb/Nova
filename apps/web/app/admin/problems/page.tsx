'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  EnhancedProblem,
  ProblemGroup,
  ProblemStatus,
  WeightValues,
  DEFAULT_WEIGHTS,
  ALL_WEIGHT_KEYS,
} from '../_lib/types/problem';
import {
  sampleProblems,
  sampleGroups,
  sampleWeightingProfiles,
} from './_data/sample-problems';

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

  // Data state - using sample data for demo
  const [problems, setProblems] = useState<EnhancedProblem[]>(sampleProblems);
  const [groups, setGroups] = useState<ProblemGroup[]>(sampleGroups);
  const [error, setError] = useState<string | null>(null);

  // View & Filter state
  const [viewMode, setViewMode] = useState<ViewMode>('list');
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

  // Group handlers
  function handleAddToGroups(groupIds: string[]) {
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
  }

  function handleRemoveFromGroups(groupIds: string[]) {
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
  }

  // Status change handler (bulk)
  function handleChangeStatus(status: ProblemStatus) {
    setProblems((prev) =>
      prev.map((problem) => {
        if (selectedIds.has(problem.id)) {
          return { ...problem, status };
        }
        return problem;
      })
    );
    clearSelection();
  }

  // Single problem status change (for Kanban drag-and-drop)
  function handleSingleStatusChange(problemId: string, status: ProblemStatus) {
    setProblems((prev) =>
      prev.map((problem) => {
        if (problem.id === problemId) {
          return { ...problem, status };
        }
        return problem;
      })
    );
  }

  function handleCreateSession() {
    const problemIdsParam = Array.from(selectedIds).join(',');
    router.push(`/admin/sessions/new?problemIds=${problemIdsParam}`);
  }

  function handleSaveGroup(groupData: Partial<ProblemGroup>) {
    if (groupData.id) {
      // Update existing
      setGroups((prev) =>
        prev.map((g) => (g.id === groupData.id ? { ...g, ...groupData } : g))
      );
    } else {
      // Create new
      const newGroup: ProblemGroup = {
        id: `grp-${Date.now()}`,
        tenantId: 'demo-tenant',
        name: groupData.name || 'New Group',
        description: groupData.description,
        color: groupData.color || '#6366f1',
        icon: 'folder',
        problemCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setGroups((prev) => [...prev, newGroup]);
    }
  }

  function handleDeleteGroup(groupId: string) {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    // Remove group from all problems
    setProblems((prev) =>
      prev.map((p) => ({
        ...p,
        groupIds: p.groupIds.filter((id) => id !== groupId),
      }))
    );
    if (activeGroupId === groupId) {
      setActiveGroupId('all');
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
              <ViewToggle viewMode={viewMode} onChange={setViewMode} />
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
