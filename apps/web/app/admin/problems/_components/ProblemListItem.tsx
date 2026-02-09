'use client';

import { EnhancedProblem, ProblemGroup } from '../../_lib/types/problem';

interface ProblemListItemProps {
  problem: EnhancedProblem;
  priorityScore: number;
  groups: ProblemGroup[];
  selected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  DISCOVERED: 'bg-blue-500',
  SHORTLISTED: 'bg-purple-500',
  BACKLOG: 'bg-gray-500',
  IN_PROGRESS: 'bg-amber-500',
  SOLVED: 'bg-green-500',
  DISCARDED: 'bg-red-500',
};

export function ProblemListItem({
  problem,
  priorityScore,
  groups,
  selected,
  onSelect,
  onViewDetails,
}: ProblemListItemProps) {
  // Get groups this problem belongs to
  const problemGroups = groups.filter((g) => problem.groupIds.includes(g.id));

  function handleClick(e: React.MouseEvent) {
    // Don't select if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    onSelect();
  }

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${
        selected
          ? 'bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-300 dark:ring-primary-700'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      {/* Selection indicator */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          selected
            ? 'bg-primary-500 border-primary-500'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        {selected && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Status dot */}
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_COLORS[problem.status] || STATUS_COLORS.DISCOVERED}`}
        title={problem.status}
      />

      {/* Title */}
      <div className="flex-1 min-w-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="text-left font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 truncate block w-full"
        >
          {problem.title}
        </button>
      </div>

      {/* Groups */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {problemGroups.slice(0, 3).map((group) => (
          <span
            key={group.id}
            className="px-2 py-0.5 text-xs rounded-full"
            style={{
              backgroundColor: `${group.color}20`,
              color: group.color,
            }}
          >
            {group.name}
          </span>
        ))}
        {problemGroups.length > 3 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            +{problemGroups.length - 3}
          </span>
        )}
      </div>

      {/* Priority Score */}
      <div className="flex-shrink-0 w-16 text-right">
        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
          {priorityScore.toFixed(0)}
        </span>
      </div>
    </div>
  );
}

export default ProblemListItem;
