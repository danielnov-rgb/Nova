"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { votersApi } from "../../../_lib/api";
import type { SessionVotersResponse, SessionVoter, VoterDetailResponse } from "../../../_lib/types";

export default function VotersPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [data, setData] = useState<SessionVotersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoter, setSelectedVoter] = useState<SessionVoter | null>(null);
  const [voterDetail, setVoterDetail] = useState<VoterDetailResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchVoters();
  }, [sessionId]);

  async function fetchVoters() {
    try {
      const result = await votersApi.list(sessionId);
      setData(result as SessionVotersResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load voters");
    } finally {
      setLoading(false);
    }
  }

  async function openVoterDetail(voter: SessionVoter) {
    setSelectedVoter(voter);
    setLoadingDetail(true);
    setVoterDetail(null);

    try {
      const detail = await votersApi.getDetail(sessionId, voter.id);
      setVoterDetail(detail);
    } catch (err) {
      console.error("Failed to load voter detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  }

  function closeModal() {
    setSelectedVoter(null);
    setVoterDetail(null);
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  }

  function getStatusBadge(voter: SessionVoter) {
    if (voter.completedAt) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          Completed
        </span>
      );
    }
    if (voter.openedAt) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          In Progress
        </span>
      );
    }
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        Not Started
      </span>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error || "Failed to load voters"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/admin/sessions/${sessionId}`}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to session
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Voters
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {data.session.title}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Voters</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.summary.totalVoters}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Public Link</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.summary.publicVoters}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Individual Links</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.summary.linkVoters}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Opened</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.summary.openedCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.summary.completedCount}
          </p>
        </div>
      </div>

      {/* Voters list */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">All Voters</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Click on a voter to see their voting details
          </p>
        </div>

        {data.voters.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No voters yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Voter
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Type
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Credits
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Opened
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {data.voters.map((voter) => (
                  <tr
                    key={voter.id}
                    onClick={() => openVoterDetail(voter)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {voter.name || voter.email}
                        </p>
                        {voter.name && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {voter.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        voter.type === "public"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}>
                        {voter.type === "public" ? "Public" : "Link"}
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(voter)}</td>
                    <td className="p-4">
                      <span className="text-gray-900 dark:text-white">
                        {voter.creditsUsed}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {" "}/ {voter.creditsAllowed}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(voter.openedAt)}
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(voter.completedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Voter Detail Modal */}
      {selectedVoter && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedVoter.name || selectedVoter.email}
                  </h2>
                  {selectedVoter.name && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedVoter.email}
                    </p>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : voterDetail ? (
                <div className="space-y-6">
                  {/* Voter Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {voterDetail.voter.type === "public" ? "Public Link" : "Individual Link"}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Credits</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {voterDetail.summary.creditsUsed} / {voterDetail.summary.creditsAllowed} used
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Opened At</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(voterDetail.voter.openedAt)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Completed At</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(voterDetail.voter.completedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Votes */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Votes ({voterDetail.summary.voteCount} of {voterDetail.summary.problemCount} problems)
                    </h3>
                    <div className="space-y-2">
                      {voterDetail.problems
                        .filter((p) => p.vote)
                        .sort((a, b) => (b.vote?.credits || 0) - (a.vote?.credits || 0))
                        .map((problem) => (
                          <div
                            key={problem.id}
                            className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {problem.title}
                              </p>
                              {problem.vote?.comment && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  "{problem.vote.comment}"
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Voted: {formatDate(problem.vote?.votedAt || null)}
                              </p>
                            </div>
                            <div className="ml-4 text-right">
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold">
                                {problem.vote?.credits}
                              </span>
                            </div>
                          </div>
                        ))}
                      {voterDetail.summary.voteCount === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                          No votes cast yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Problems not voted on */}
                  {voterDetail.problems.filter((p) => !p.vote).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                        Not Voted ({voterDetail.problems.filter((p) => !p.vote).length})
                      </h3>
                      <div className="space-y-1">
                        {voterDetail.problems
                          .filter((p) => !p.vote)
                          .map((problem) => (
                            <div
                              key={problem.id}
                              className="text-sm text-gray-500 dark:text-gray-400 py-1"
                            >
                              • {problem.title}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Failed to load voter details
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
