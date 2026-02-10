"use client";

import type { VoterGroupType } from "../../../_lib/types";

export interface SelectedVoter {
  id: string;
  source: "group" | "manual";
  email: string;
  name?: string;
  type: VoterGroupType;
  sourceGroupId?: string;
  sourceGroupName?: string;
}

interface VoterChipProps {
  voter: SelectedVoter;
  onRemove: (id: string) => void;
}

const typeColors: Record<VoterGroupType, string> = {
  LEADERSHIP: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  PROJECT_TEAM: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  EXTERNAL_USER: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
};

export function VoterChip({ voter, onRemove }: VoterChipProps) {
  const displayName = voter.name || voter.email;
  const colorClasses = typeColors[voter.type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm border ${colorClasses}`}
    >
      <span className="truncate max-w-[180px]" title={voter.email}>
        {displayName}
      </span>
      <button
        type="button"
        onClick={() => onRemove(voter.id)}
        className="flex-shrink-0 hover:opacity-70 focus:outline-none"
        aria-label={`Remove ${displayName}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
