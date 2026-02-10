"use client";

import { useState, useEffect } from "react";
import type { Problem } from "../../../_lib/types";

interface AddProblemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  problems: Problem[];
  selectedProblemIds: Set<string>;
  onAddProblems: (ids: string[]) => void;
}

export function AddProblemsModal({
  isOpen,
  onClose,
  problems,
  selectedProblemIds,
  onAddProblems,
}: AddProblemsModalProps) {
  const [search, setSearch] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setTempSelectedIds(new Set());
      setSearch("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const availableProblems = problems.filter((p) => !selectedProblemIds.has(p.id));
  const filteredProblems = availableProblems.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  function toggleProblem(id: string) {
    setTempSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectAll() {
    setTempSelectedIds(new Set(filteredProblems.map((p) => p.id)));
  }

  function clearSelection() {
    setTempSelectedIds(new Set());
  }

  function handleAdd() {
    onAddProblems(Array.from(tempSelectedIds));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add More Problems
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search and controls */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            autoFocus
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {availableProblems.length} problems available
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Select all visible
              </button>
              {tempSelectedIds.size > 0 && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Problem list */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {availableProblems.length === 0
                  ? "All problems have already been selected"
                  : "No problems match your search"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProblems.map((problem) => (
                <label
                  key={problem.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    tempSelectedIds.has(problem.id)
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tempSelectedIds.has(problem.id)}
                    onChange={() => toggleProblem(problem.id)}
                    className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {problem.title}
                    </p>
                    {problem.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
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
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {tempSelectedIds.size} problem{tempSelectedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={tempSelectedIds.size === 0}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Add {tempSelectedIds.size} Problem{tempSelectedIds.size !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
