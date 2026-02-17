"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { voterGroupsApi, teamCodesApi } from "../../_lib/api";
import type { VoterGroup, TeamCode, VoterGroupMember, VoterGroupType, CreateTeamCodeDto } from "../../_lib/types";

const groupTypeLabels: Record<VoterGroupType, string> = {
  LEADERSHIP: "Leadership",
  PROJECT_TEAM: "Project Team",
  EXTERNAL_USER: "External Users",
};

const groupTypeColors: Record<VoterGroupType, string> = {
  LEADERSHIP: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  PROJECT_TEAM: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  EXTERNAL_USER: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function VoterGroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [group, setGroup] = useState<VoterGroup | null>(null);
  const [members, setMembers] = useState<VoterGroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateCode, setShowCreateCode] = useState(false);
  const [newCode, setNewCode] = useState<CreateTeamCodeDto>({
    code: "",
    description: "",
    maxUses: undefined,
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadGroup();
    loadMembers();
  }, [id]);

  async function loadGroup() {
    try {
      setLoading(true);
      const data = await voterGroupsApi.get(id);
      setGroup(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load group");
    } finally {
      setLoading(false);
    }
  }

  async function loadMembers() {
    try {
      const data = await voterGroupsApi.getMembers(id);
      setMembers(data);
    } catch (err) {
      console.error("Failed to load members:", err);
    }
  }

  async function handleCreateCode(e: React.FormEvent) {
    e.preventDefault();
    if (!newCode.code) return;

    setCreating(true);
    try {
      await voterGroupsApi.createTeamCode(id, newCode);
      setShowCreateCode(false);
      setNewCode({ code: "", description: "", maxUses: undefined });
      loadGroup();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create code");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteCode(codeId: string, code: string) {
    if (!confirm(`Delete team code "${code}"?`)) return;

    try {
      await teamCodesApi.delete(codeId);
      loadGroup();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete code");
    }
  }

  async function handleToggleCode(codeId: string, isActive: boolean) {
    try {
      await teamCodesApi.update(codeId, { isActive: !isActive });
      loadGroup();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update code");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">{error || "Group not found"}</p>
          <Link href="/admin/groups" className="mt-2 text-sm text-red-600 dark:text-red-400 underline">
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  const joinUrl = typeof window !== "undefined" ? `${window.location.origin}/join` : "/join";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/groups"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Groups
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {group.name}
              </h1>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${groupTypeColors[group.type]}`}>
                {groupTypeLabels[group.type]}
              </span>
            </div>
            {group.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {group.description}
              </p>
            )}
          </div>
          <div className="text-right text-sm text-gray-500 dark:text-gray-500">
            <p>{group.defaultCredits} credits</p>
            <p>{group.weight ?? 1}x weight</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {members.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Members</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {group.teamCodes?.length ?? 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Team Codes</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {group.teamCodes?.filter((c) => c.isActive).length ?? 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Active Codes</p>
        </div>
      </div>

      {/* Team Codes Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Team Codes</h2>
          <button
            onClick={() => setShowCreateCode(true)}
            className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg font-medium transition-colors"
          >
            Create Code
          </button>
        </div>

        {showCreateCode && (
          <form onSubmit={handleCreateCode} className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-500 mb-1">Code *</label>
                <input
                  type="text"
                  required
                  value={newCode.code}
                  onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                  placeholder="LEAD2024"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-500 mb-1">Description</label>
                <input
                  type="text"
                  value={newCode.description || ""}
                  onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Leadership team code"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-500 mb-1">Max Uses</label>
                <input
                  type="number"
                  min="1"
                  value={newCode.maxUses || ""}
                  onChange={(e) => setNewCode({ ...newCode, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Unlimited"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowCreateCode(false)}
                className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating || !newCode.code}
                className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white text-sm rounded-lg font-medium transition-colors"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        )}

        {!group.teamCodes || group.teamCodes.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 dark:text-gray-500">No team codes yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
              Create a code to allow users to join this group
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {group.teamCodes.map((code) => (
              <div key={code.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-gray-900 dark:text-white">
                      {code.code}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`${joinUrl}/${code.code}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Copy join link"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    {code.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{code.description}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {code.usesCount} / {code.maxUses ?? "∞"} uses
                      {code.expiresAt && ` • Expires ${new Date(code.expiresAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleCode(code.id, code.isActive)}
                    className={`px-2 py-1 text-xs rounded ${
                      code.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                    }`}
                  >
                    {code.isActive ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => handleDeleteCode(code.id, code.code)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Delete code"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Members Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Members</h2>
        </div>

        {members.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 dark:text-gray-500">No members yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
              Members will appear here when they redeem a team code
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {members.map((member) => (
              <div key={member.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {member.user.firstName && member.user.lastName
                      ? `${member.user.firstName} ${member.user.lastName}`
                      : member.user.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {member.user.email} • Joined via {member.joinedVia.replace("_", " ").toLowerCase()}
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
