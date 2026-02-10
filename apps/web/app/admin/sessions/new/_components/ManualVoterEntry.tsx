"use client";

import { useState } from "react";
import type { VoterGroupType } from "../../../_lib/types";
import type { SelectedVoter } from "./VoterChip";

interface ManualVoterEntryProps {
  onAddVoter: (voter: SelectedVoter) => void;
  existingEmails: Set<string>;
}

export function ManualVoterEntry({ onAddVoter, existingEmails }: ManualVoterEntryProps) {
  const [email, setEmail] = useState("");
  const [type, setType] = useState<VoterGroupType>("EXTERNAL_USER");
  const [error, setError] = useState<string | null>(null);

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleAdd() {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (existingEmails.has(trimmedEmail)) {
      setError("This email has already been added");
      return;
    }

    const voter: SelectedVoter = {
      id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: "manual",
      email: trimmedEmail,
      type,
    };

    onAddVoter(voter);
    setEmail("");
    setError(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Add Voter Manually
      </h4>
      <div className="flex gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as VoterGroupType)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="EXTERNAL_USER">External User</option>
          <option value="PROJECT_TEAM">Project Team</option>
          <option value="LEADERSHIP">Leadership</option>
        </select>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="voter@example.com"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Add
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
