'use client';

import React, { useState } from 'react';
import { EnhancedProblem, ProblemStatus, ProblemGroup } from '../../_lib/types/problem';

const STATUS_COLUMNS: { status: ProblemStatus; label: string; color: string; bgColor: string }[] = [
  { status: 'DISCOVERED', label: 'Discovered', color: 'bg-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { status: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
  { status: 'BACKLOG', label: 'Backlog', color: 'bg-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-800/50' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  { status: 'SOLVED', label: 'Solved', color: 'bg-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  { status: 'DISCARDED', label: 'Discarded', color: 'bg-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
];

interface KanbanBoardProps {
  problems: (EnhancedProblem & { priorityScore?: number })[];
  groups: ProblemGroup[];
  onStatusChange: (problemId: string, newStatus: ProblemStatus) => void;
  onViewDetails: (problemId: string) => void;
}

export function KanbanBoard({ problems, groups, onStatusChange, onViewDetails }: KanbanBoardProps) {
  const [draggedProblem, setDraggedProblem] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ProblemStatus | null>(null);

  // Group problems by status
  const problemsByStatus = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.status] = problems.filter((p) => p.status === col.status);
    return acc;
  }, {} as Record<ProblemStatus, typeof problems>);

  function handleDragStart(e: React.DragEvent, problemId: string) {
    setDraggedProblem(problemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', problemId);
  }

  function handleDragEnd() {
    setDraggedProblem(null);
    setDragOverColumn(null);
  }

  function handleDragOver(e: React.DragEvent, status: ProblemStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  }

  function handleDragLeave() {
    setDragOverColumn(null);
  }

  function handleDrop(e: React.DragEvent, newStatus: ProblemStatus) {
    e.preventDefault();
    const problemId = e.dataTransfer.getData('text/plain');
    if (problemId) {
      const problem = problems.find((p) => p.id === problemId);
      if (problem && problem.status !== newStatus) {
        onStatusChange(problemId, newStatus);
      }
    }
    setDraggedProblem(null);
    setDragOverColumn(null);
  }

  function getGroupsForProblem(problem: EnhancedProblem) {
    return groups.filter((g) => problem.groupIds.includes(g.id));
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-4 pt-4">
      {STATUS_COLUMNS.map((column) => {
        const columnProblems = problemsByStatus[column.status] || [];
        const isDropTarget = dragOverColumn === column.status;

        return (
          <div
            key={column.status}
            className="flex-shrink-0 w-72"
            onDragOver={(e) => handleDragOver(e, column.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-medium text-gray-900 dark:text-white">{column.label}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({columnProblems.length})
              </span>
            </div>

            {/* Column Content */}
            <div
              className={`min-h-[400px] rounded-lg border-2 border-dashed transition-colors ${
                isDropTarget
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 ' + column.bgColor
              }`}
            >
              <div className="p-2 space-y-2">
                {columnProblems.map((problem) => (
                  <KanbanCard
                    key={problem.id}
                    problem={problem}
                    groups={getGroupsForProblem(problem)}
                    isDragging={draggedProblem === problem.id}
                    onDragStart={(e) => handleDragStart(e, problem.id)}
                    onDragEnd={handleDragEnd}
                    onViewDetails={() => onViewDetails(problem.id)}
                  />
                ))}

                {columnProblems.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">
                    {isDropTarget ? 'Drop here' : 'No problems'}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface KanbanCardProps {
  problem: EnhancedProblem & { priorityScore?: number };
  groups: ProblemGroup[];
  isDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onViewDetails: () => void;
}

function KanbanCard({
  problem,
  groups,
  isDragging,
  onDragStart,
  onDragEnd,
  onViewDetails,
}: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onViewDetails}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
    >
      {/* Title */}
      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
        {problem.title}
      </h4>

      {/* Priority Score */}
      {problem.priorityScore !== undefined && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                problem.priorityScore >= 70
                  ? 'bg-green-500'
                  : problem.priorityScore >= 40
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${problem.priorityScore}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-8 text-right">
            {Math.round(problem.priorityScore)}
          </span>
        </div>
      )}

      {/* Groups */}
      {groups.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {groups.slice(0, 2).map((group) => (
            <span
              key={group.id}
              className="px-1.5 py-0.5 text-xs rounded-full text-white"
              style={{ backgroundColor: group.color || '#6b7280' }}
            >
              {group.name}
            </span>
          ))}
          {groups.length > 2 && (
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              +{groups.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Drag handle indicator */}
      <div className="mt-2 flex justify-center">
        <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}

export default KanbanBoard;
