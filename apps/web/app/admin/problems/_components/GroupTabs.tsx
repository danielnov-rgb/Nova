'use client';

import { ProblemGroup, EnhancedProblem } from '../../_lib/types/problem';

interface GroupTabsProps {
  groups: ProblemGroup[];
  problems: EnhancedProblem[];
  activeGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onCreateGroup: () => void;
}

export function GroupTabs({
  groups,
  problems,
  activeGroupId,
  onSelectGroup,
  onCreateGroup,
}: GroupTabsProps) {
  // Count problems per group
  function getGroupCount(groupId: string): number {
    if (groupId === 'all') {
      return problems.length;
    }
    return problems.filter((p) => p.groupIds.includes(groupId)).length;
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-1 overflow-x-auto pb-px -mb-px scrollbar-thin">
        {/* All tab */}
        <button
          onClick={() => onSelectGroup('all')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeGroupId === 'all'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          All
          <span
            className={`px-1.5 py-0.5 text-xs rounded-full ${
              activeGroupId === 'all'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
          >
            {getGroupCount('all')}
          </span>
        </button>

        {/* Group tabs */}
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeGroupId === group.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {group.color && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: group.color }}
              />
            )}
            {group.name}
            <span
              className={`px-1.5 py-0.5 text-xs rounded-full ${
                activeGroupId === group.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
            >
              {getGroupCount(group.id)}
            </span>
          </button>
        ))}

        {/* Add group button */}
        <button
          onClick={onCreateGroup}
          className="flex items-center gap-1 px-3 py-2.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Create new group"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="sr-only">New Group</span>
        </button>
      </div>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

export default GroupTabs;
