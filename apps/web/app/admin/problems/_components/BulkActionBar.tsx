'use client';

import React from 'react';
import { ProblemGroup, ProblemStatus } from '../../_lib/types/problem';

const STATUS_OPTIONS: { value: ProblemStatus; label: string; color: string }[] = [
  { value: 'DISCOVERED', label: 'Discovered', color: 'bg-blue-500' },
  { value: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-purple-500' },
  { value: 'BACKLOG', label: 'Backlog', color: 'bg-gray-500' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-500' },
  { value: 'SOLVED', label: 'Solved', color: 'bg-green-500' },
  { value: 'DISCARDED', label: 'Discarded', color: 'bg-red-500' },
];

interface BulkActionBarProps {
  selectedCount: number;
  groups: ProblemGroup[];
  onAddToGroups: (groupIds: string[]) => void;
  onRemoveFromGroups: (groupIds: string[]) => void;
  onChangeStatus: (status: ProblemStatus) => void;
  onCreateSession: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedCount,
  groups,
  onAddToGroups,
  onRemoveFromGroups,
  onChangeStatus,
  onCreateSession,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
          {selectedCount} problem{selectedCount !== 1 ? 's' : ''} selected
        </span>

        <div className="flex items-center gap-2">
          {/* Add to Group Dropdown */}
          <AddToGroupButton groups={groups} onSelect={onAddToGroups} />

          {/* Change Status Dropdown */}
          <ChangeStatusButton onSelect={onChangeStatus} />

          {/* Create Voting Session */}
          <button
            onClick={onCreateSession}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <VoteIcon className="w-4 h-4" />
            Create Voting Session
          </button>
        </div>
      </div>

      <button
        onClick={onClearSelection}
        className="p-1.5 text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200 transition-colors"
        title="Clear selection"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

interface ChangeStatusButtonProps {
  onSelect: (status: ProblemStatus) => void;
}

function ChangeStatusButton({ onSelect }: ChangeStatusButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(status: ProblemStatus) {
    onSelect(status);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-700 dark:text-primary-300 bg-white dark:bg-gray-800 border border-primary-300 dark:border-primary-700 hover:border-primary-400 dark:hover:border-primary-600 rounded-lg transition-colors"
      >
        <StatusIcon className="w-4 h-4" />
        Change Status
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-1">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
              >
                <span className={`w-2 h-2 rounded-full ${option.color}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface AddToGroupButtonProps {
  groups: ProblemGroup[];
  onSelect: (groupIds: string[]) => void;
}

function AddToGroupButton({ groups, onSelect }: AddToGroupButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedGroups, setSelectedGroups] = React.useState<Set<string>>(new Set());
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleGroup(groupId: string) {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId);
    } else {
      newSelected.add(groupId);
    }
    setSelectedGroups(newSelected);
  }

  function handleApply() {
    onSelect(Array.from(selectedGroups));
    setSelectedGroups(new Set());
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-700 dark:text-primary-300 bg-white dark:bg-gray-800 border border-primary-300 dark:border-primary-700 hover:border-primary-400 dark:hover:border-primary-600 rounded-lg transition-colors"
      >
        <FolderPlusIcon className="w-4 h-4" />
        Add to Group
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-2 max-h-64 overflow-y-auto">
            {groups.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 p-2">
                No groups created yet
              </p>
            ) : (
              groups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedGroups.has(group.id)}
                    onChange={() => toggleGroup(group.id)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                  />
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: group.color || '#6b7280' }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {group.name}
                  </span>
                </label>
              ))
            )}
          </div>

          {groups.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
              <button
                onClick={handleApply}
                disabled={selectedGroups.size === 0}
                className="w-full px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Add to {selectedGroups.size} Group{selectedGroups.size !== 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function VoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function StatusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
  );
}

function FolderPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default BulkActionBar;
