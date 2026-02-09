'use client';

import { EnhancedProblem, SCORE_LABELS, ScoreWithMeta, ProblemScores, ProblemGroup } from '../../_lib/types/problem';

interface ProblemCardProps {
  problem: EnhancedProblem;
  priorityScore: number;
  groups: ProblemGroup[];
  selected?: boolean;
  onSelect?: () => void;
  onMoveToShortlist?: () => void;
  onRemoveFromShortlist?: () => void;
  onViewDetails?: () => void;
  isShortlisted?: boolean;
  compact?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  DISCOVERED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  SHORTLISTED: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  BACKLOG: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  IN_PROGRESS: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  SOLVED: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  DISCARDED: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
};

export function ProblemCard({
  problem,
  priorityScore,
  groups,
  selected = false,
  onSelect,
  onMoveToShortlist,
  onRemoveFromShortlist,
  onViewDetails,
  isShortlisted = false,
  compact = false,
}: ProblemCardProps) {
  const topScores = getTopScores(problem.scores);
  const problemGroups = groups.filter((g) => problem.groupIds.includes(g.id));

  function handleClick(e: React.MouseEvent) {
    // Don't select if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    onSelect?.();
  }

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={`bg-white dark:bg-gray-800 rounded-lg border p-3 transition-colors cursor-pointer ${
          selected
            ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
              {problem.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {priorityScore.toFixed(0)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">score</span>
            </div>
          </div>
          {isShortlisted ? (
            onRemoveFromShortlist && (
              <button
                onClick={onRemoveFromShortlist}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove from shortlist"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
            )
          ) : (
            onMoveToShortlist && (
              <button
                onClick={onMoveToShortlist}
                className="p-1.5 text-gray-400 hover:text-primary-500 transition-colors"
                title="Add to shortlist"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white dark:bg-gray-800 rounded-xl border p-4 transition-colors cursor-pointer ${
        selected
          ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                STATUS_COLORS[problem.status] || STATUS_COLORS.DISCOVERED
              }`}
            >
              {problem.status}
            </span>
            {problem.source !== 'MANUAL' && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {problem.source}
              </span>
            )}
          </div>
          <h4
            className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
            onClick={onViewDetails}
          >
            {problem.title}
          </h4>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {priorityScore.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">priority</div>
        </div>
      </div>

      {/* Description */}
      {problem.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {problem.description}
        </p>
      )}

      {/* Score Bars */}
      <div className="space-y-1.5 mb-3">
        {topScores.map(({ key, score }) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 w-20 truncate">
              {SCORE_LABELS[key as keyof typeof SCORE_LABELS]}
            </span>
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all"
                style={{ width: `${score.value}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
              {score.value}
            </span>
          </div>
        ))}
      </div>

      {/* Groups */}
      {problemGroups.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {problemGroups.map((group) => (
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
        </div>
      )}

      {/* Tags */}
      {problem.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {problem.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
          {problem.tags.length > 4 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{problem.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={onViewDetails}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
        >
          View Details
        </button>
        {isShortlisted ? (
          onRemoveFromShortlist && (
            <button
              onClick={onRemoveFromShortlist}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Remove
            </button>
          )
        ) : (
          onMoveToShortlist && (
            <button
              onClick={onMoveToShortlist}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              Shortlist
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          )
        )}
      </div>
    </div>
  );
}

function getTopScores(scores: ProblemScores): { key: string; score: ScoreWithMeta }[] {
  return (Object.entries(scores) as [string, ScoreWithMeta][])
    .sort((a, b) => (b[1]?.value || 0) - (a[1]?.value || 0))
    .slice(0, 3)
    .map(([key, score]) => ({ key, score }));
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
    </svg>
  );
}

export default ProblemCard;
