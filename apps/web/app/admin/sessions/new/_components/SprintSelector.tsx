"use client";

import { useState } from "react";
import { sprintsApi } from "../../../_lib/api";
import type { Sprint, SprintStatus } from "../../../_lib/types";

interface SprintSelectorProps {
  sprints: Sprint[];
  value: string;
  onChange: (sprintId: string) => void;
  onSprintCreated: (sprint: Sprint) => void;
}

export function SprintSelector({ sprints, value, onChange, onSprintCreated }: SprintSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newSprintName, setNewSprintName] = useState("");
  const [newSprintStatus, setNewSprintStatus] = useState<SprintStatus>("PLANNING");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateSprint() {
    if (!newSprintName.trim()) {
      setError("Sprint name is required");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const sprint = await sprintsApi.create({
        name: newSprintName.trim(),
        status: newSprintStatus,
      });
      onSprintCreated(sprint);
      onChange(sprint.id);
      setIsCreating(false);
      setNewSprintName("");
      setNewSprintStatus("PLANNING");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create sprint");
    } finally {
      setCreating(false);
    }
  }

  function handleCancel() {
    setIsCreating(false);
    setNewSprintName("");
    setNewSprintStatus("PLANNING");
    setError(null);
  }

  if (isCreating) {
    return (
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sprint Name *
            </label>
            <input
              type="text"
              value={newSprintName}
              onChange={(e) => setNewSprintName(e.target.value)}
              placeholder="e.g., Q1 2026 Sprint"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={newSprintStatus}
              onChange={(e) => setNewSprintStatus(e.target.value as SprintStatus)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
            </select>
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={creating}
              className="flex-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateSprint}
              disabled={creating}
              className="flex-1 px-3 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Sprint"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(e) => {
          if (e.target.value === "__create__") {
            setIsCreating(true);
          } else {
            onChange(e.target.value);
          }
        }}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="">No sprint</option>
        {sprints.map((sprint) => (
          <option key={sprint.id} value={sprint.id}>
            {sprint.name}
            {sprint.status !== "ACTIVE" && ` (${sprint.status.toLowerCase()})`}
          </option>
        ))}
        <option value="__create__">+ Create new sprint...</option>
      </select>
    </div>
  );
}
