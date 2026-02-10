"use client";

import { useState, useEffect } from "react";
import { voterGroupsApi } from "../../../_lib/api";
import type { VoterGroup, VoterGroupMember } from "../../../_lib/types";
import type { SelectedVoter } from "./VoterChip";

interface VoterGroupExpanderProps {
  group: VoterGroup;
  selectedVoterIds: Set<string>;
  onAddVoters: (voters: SelectedVoter[]) => void;
}

const typeColors: Record<string, string> = {
  LEADERSHIP: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  PROJECT_TEAM: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  EXTERNAL_USER: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function VoterGroupExpander({ group, selectedVoterIds, onAddVoters }: VoterGroupExpanderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [members, setMembers] = useState<VoterGroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isExpanded && members.length === 0) {
      loadMembers();
    }
  }, [isExpanded]);

  async function loadMembers() {
    setLoading(true);
    try {
      const data = await voterGroupsApi.getMembers(group.id);
      setMembers(data);
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  }

  function toggleMember(memberId: string) {
    setSelectedMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  }

  function selectAll() {
    const availableIds = members
      .filter((m) => !selectedVoterIds.has(m.user.email))
      .map((m) => m.id);
    setSelectedMemberIds(new Set(availableIds));
  }

  function clearSelection() {
    setSelectedMemberIds(new Set());
  }

  function handleAddSelected() {
    const votersToAdd: SelectedVoter[] = members
      .filter((m) => selectedMemberIds.has(m.id))
      .map((m) => ({
        id: `${group.id}-${m.user.id}`,
        source: "group" as const,
        email: m.user.email,
        name: m.user.firstName && m.user.lastName
          ? `${m.user.firstName} ${m.user.lastName}`
          : m.user.firstName || undefined,
        type: group.type,
        sourceGroupId: group.id,
        sourceGroupName: group.name,
      }));

    onAddVoters(votersToAdd);
    setSelectedMemberIds(new Set());
    setIsExpanded(false);
  }

  function handleAddAll() {
    const votersToAdd: SelectedVoter[] = members
      .filter((m) => !selectedVoterIds.has(m.user.email))
      .map((m) => ({
        id: `${group.id}-${m.user.id}`,
        source: "group" as const,
        email: m.user.email,
        name: m.user.firstName && m.user.lastName
          ? `${m.user.firstName} ${m.user.lastName}`
          : m.user.firstName || undefined,
        type: group.type,
        sourceGroupId: group.id,
        sourceGroupName: group.name,
      }));

    onAddVoters(votersToAdd);
    setIsExpanded(false);
  }

  const memberCount = group._count?.memberships ?? 0;
  const availableCount = members.filter((m) => !selectedVoterIds.has(m.user.email)).length;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-gray-900 dark:text-white">{group.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${typeColors[group.type]}`}>
            {group.type.replace("_", " ")}
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {memberCount} member{memberCount !== 1 ? "s" : ""}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
            </div>
          ) : members.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No members in this group
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Select all available
                  </button>
                  {selectedMemberIds.size > 0 && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <button
                        type="button"
                        onClick={clearSelection}
                        className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAddAll}
                  disabled={availableCount === 0}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add all ({availableCount})
                </button>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {members.map((member) => {
                  const isAlreadySelected = selectedVoterIds.has(member.user.email);
                  const displayName = member.user.firstName && member.user.lastName
                    ? `${member.user.firstName} ${member.user.lastName}`
                    : member.user.email;

                  return (
                    <label
                      key={member.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                        isAlreadySelected
                          ? "bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                          : selectedMemberIds.has(member.id)
                          ? "bg-primary-50 dark:bg-primary-900/20"
                          : "hover:bg-white dark:hover:bg-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMemberIds.has(member.id) || isAlreadySelected}
                        onChange={() => !isAlreadySelected && toggleMember(member.id)}
                        disabled={isAlreadySelected}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-white flex-1 truncate">
                        {displayName}
                      </span>
                      {isAlreadySelected && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Added</span>
                      )}
                    </label>
                  );
                })}
              </div>

              {selectedMemberIds.size > 0 && (
                <button
                  type="button"
                  onClick={handleAddSelected}
                  className="mt-3 w-full px-3 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
                >
                  Add {selectedMemberIds.size} selected
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
