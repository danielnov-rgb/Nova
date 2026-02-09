'use client';

import React from 'react';
import { ProblemStatus } from '../../_lib/types/problem';

const STATUS_OPTIONS: { value: ProblemStatus; label: string; color: string }[] = [
  { value: 'DISCOVERED', label: 'Discovered', color: 'bg-blue-500' },
  { value: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-purple-500' },
  { value: 'BACKLOG', label: 'Backlog', color: 'bg-gray-500' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-500' },
  { value: 'SOLVED', label: 'Solved', color: 'bg-green-500' },
  { value: 'DISCARDED', label: 'Discarded', color: 'bg-red-500' },
];

interface StatusFilterProps {
  selectedStatuses: Set<ProblemStatus>;
  onChange: (statuses: Set<ProblemStatus>) => void;
}

export function StatusFilter({ selectedStatuses, onChange }: StatusFilterProps) {
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

  function toggleStatus(status: ProblemStatus) {
    const newSelected = new Set(selectedStatuses);
    if (newSelected.has(status)) {
      newSelected.delete(status);
    } else {
      newSelected.add(status);
    }
    onChange(newSelected);
  }

  function selectAll() {
    onChange(new Set(STATUS_OPTIONS.map((o) => o.value)));
  }

  function clearAll() {
    onChange(new Set());
  }

  const allSelected = selectedStatuses.size === STATUS_OPTIONS.length;
  const noneSelected = selectedStatuses.size === 0;
  const buttonLabel =
    noneSelected || allSelected
      ? 'All Status'
      : selectedStatuses.size === 1
        ? STATUS_OPTIONS.find((o) => selectedStatuses.has(o.value))?.label || 'Status'
        : `${selectedStatuses.size} statuses`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors ${
          !noneSelected && !allSelected
            ? 'border-primary-400 dark:border-primary-600'
            : 'border-gray-300 dark:border-gray-700'
        }`}
      >
        <span className="text-sm">{buttonLabel}</span>
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {/* Quick actions */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={selectAll}
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
            >
              Select all
            </button>
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
            >
              Clear
            </button>
          </div>

          {/* Status options */}
          <div className="p-2">
            {STATUS_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.has(option.value)}
                  onChange={() => toggleStatus(option.value)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                <span className={`w-2 h-2 rounded-full ${option.color}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default StatusFilter;
