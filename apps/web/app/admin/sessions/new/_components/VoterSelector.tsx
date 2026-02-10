"use client";

import type { VoterGroup } from "../../../_lib/types";
import { VoterChip, type SelectedVoter } from "./VoterChip";
import { VoterGroupExpander } from "./VoterGroupExpander";
import { ManualVoterEntry } from "./ManualVoterEntry";
import { RequiredFieldsSelector, type RequiredField } from "./RequiredFieldsSelector";

interface VoterSelectorProps {
  voterGroups: VoterGroup[];
  selectedVoters: SelectedVoter[];
  requiredFields: RequiredField[];
  onVotersChange: (voters: SelectedVoter[]) => void;
  onRequiredFieldsChange: (fields: RequiredField[]) => void;
}

export function VoterSelector({
  voterGroups,
  selectedVoters,
  requiredFields,
  onVotersChange,
  onRequiredFieldsChange,
}: VoterSelectorProps) {
  const selectedEmails = new Set(selectedVoters.map((v) => v.email));

  function handleAddVoters(voters: SelectedVoter[]) {
    // Filter out any that are already added (by email)
    const newVoters = voters.filter((v) => !selectedEmails.has(v.email));
    if (newVoters.length > 0) {
      onVotersChange([...selectedVoters, ...newVoters]);
    }
  }

  function handleAddVoter(voter: SelectedVoter) {
    handleAddVoters([voter]);
  }

  function handleRemoveVoter(id: string) {
    onVotersChange(selectedVoters.filter((v) => v.id !== id));
  }

  // Group voters by type for summary
  const votersByType = selectedVoters.reduce(
    (acc, voter) => {
      acc[voter.type] = (acc[voter.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Selected Voters Display */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Selected Voters ({selectedVoters.length})
          </h3>
          {selectedVoters.length > 0 && (
            <button
              type="button"
              onClick={() => onVotersChange([])}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          )}
        </div>

        {selectedVoters.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No voters selected yet. Add voters from groups below or manually.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto">
            {selectedVoters.map((voter) => (
              <VoterChip key={voter.id} voter={voter} onRemove={handleRemoveVoter} />
            ))}
          </div>
        )}

        {selectedVoters.length > 0 && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {Object.entries(votersByType)
              .map(([type, count]) => `${count} ${type.replace("_", " ").toLowerCase()}`)
              .join(" • ")}
          </p>
        )}
      </div>

      {/* Voter Groups */}
      {voterGroups.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Add from Voter Groups
          </h3>
          <div className="space-y-2">
            {voterGroups.map((group) => (
              <VoterGroupExpander
                key={group.id}
                group={group}
                selectedVoterIds={selectedEmails}
                onAddVoters={handleAddVoters}
              />
            ))}
          </div>
        </div>
      )}

      {/* Manual Entry */}
      <ManualVoterEntry onAddVoter={handleAddVoter} existingEmails={selectedEmails} />

      {/* Required Fields */}
      <RequiredFieldsSelector
        selectedFields={requiredFields}
        onChange={onRequiredFieldsChange}
      />
    </div>
  );
}

export { type SelectedVoter } from "./VoterChip";
export { type RequiredField } from "./RequiredFieldsSelector";
