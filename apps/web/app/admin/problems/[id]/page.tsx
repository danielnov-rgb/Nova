'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { problemsApi, CommentResponse, FavouriteStatusResponse } from '../../_lib/api';
import { Problem } from '../../_lib/types';
import { SCORE_LABELS, EvidenceItem } from '../../_lib/types/problem';
import { getUser } from '../../_lib/auth';

// Helper to extract score value (handles both number and object formats)
function extractScore(score: unknown): { value: number; justification?: string; source?: string } {
  if (typeof score === 'number') {
    return { value: score };
  }
  if (score && typeof score === 'object' && 'value' in score) {
    return score as { value: number; justification?: string; source?: string };
  }
  return { value: 0 };
}

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Favourite state
  const [favouriteStatus, setFavouriteStatus] = useState<FavouriteStatusResponse | null>(null);
  const [loadingFavourite, setLoadingFavourite] = useState(false);

  // Comments state
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // Current user for comment ownership
  const currentUser = getUser();

  useEffect(() => {
    async function fetchProblem() {
      try {
        setLoading(true);
        const data = await problemsApi.get(problemId);
        setProblem(data);
      } catch (err) {
        console.error('Failed to fetch problem:', err);
        setError('Failed to load problem');
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [problemId]);

  // Fetch favourite status and comments after problem loads
  useEffect(() => {
    if (!problem) return;

    async function fetchExtras() {
      try {
        const [favStatus, commentsData] = await Promise.all([
          problemsApi.getFavouriteStatus(problemId),
          problemsApi.getComments(problemId),
        ]);
        setFavouriteStatus(favStatus);
        setComments(commentsData);
      } catch (err) {
        console.error('Failed to load favourites/comments:', err);
      }
    }
    fetchExtras();
  }, [problem, problemId]);

  // Favourite handlers
  async function handleToggleFavourite() {
    if (!favouriteStatus) return;
    setLoadingFavourite(true);
    try {
      if (favouriteStatus.isFavourited) {
        await problemsApi.removeFavourite(problemId);
        setFavouriteStatus((prev) => prev ? { ...prev, isFavourited: false, favouriteCount: Math.max(0, prev.favouriteCount - 1) } : null);
      } else {
        await problemsApi.addFavourite(problemId);
        setFavouriteStatus((prev) => prev ? { ...prev, isFavourited: true, favouriteCount: prev.favouriteCount + 1 } : null);
      }
    } catch (err) {
      console.error('Failed to toggle favourite:', err);
    } finally {
      setLoadingFavourite(false);
    }
  }

  // Comment handlers
  async function handleAddComment() {
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const comment = await problemsApi.addComment(problemId, newComment.trim());
      setComments((prev) => [comment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  }

  async function handleUpdateComment(commentId: string) {
    if (!editingContent.trim()) return;
    try {
      const updated = await problemsApi.updateComment(problemId, commentId, editingContent.trim());
      setComments((prev) => prev.map((c) => c.id === commentId ? updated : c));
      setEditingCommentId(null);
      setEditingContent('');
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await problemsApi.deleteComment(problemId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  }

  function startEditingComment(comment: CommentResponse) {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading problem...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Problem Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || `The problem with ID "${problemId}" could not be found.`}
            </p>
            <Link
              href="/admin/problems"
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Back to Problems
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Process scores to ensure consistent format
  const processedScores = problem.scores
    ? Object.entries(problem.scores).reduce((acc, [key, value]) => {
        acc[key] = extractScore(value);
        return acc;
      }, {} as Record<string, { value: number; justification?: string; source?: string }>)
    : {};

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button & Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back to Problems
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={problem.status || 'DISCOVERED'} />
                {favouriteStatus && favouriteStatus.favouriteCount > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <StarIcon filled className="w-3 h-3 text-amber-400" />
                    {favouriteStatus.favouriteCount}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {problem.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Favourite Button */}
              <button
                onClick={handleToggleFavourite}
                disabled={loadingFavourite || !favouriteStatus}
                className={`p-2 rounded-lg border transition-colors ${
                  favouriteStatus?.isFavourited
                    ? 'border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                    : 'border-gray-300 dark:border-gray-700 text-gray-400 hover:text-amber-500 hover:border-amber-300 dark:hover:border-amber-700'
                } disabled:opacity-50`}
                title={favouriteStatus?.isFavourited ? 'Remove from favourites' : 'Add to favourites'}
              >
                <StarIcon filled={favouriteStatus?.isFavourited} className="w-5 h-5" />
              </button>
              <Link
                href={`/admin/problems/${problem.id}/edit`}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>

        {/* Tags */}
        {problem.tags && problem.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Description
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {problem.description || 'No description provided.'}
          </p>

          {problem.hypothesis && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                Hypothesis
              </h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                {problem.hypothesis}
              </p>
            </div>
          )}
        </div>

        {/* Scoring */}
        {Object.keys(processedScores).length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Scoring Attributes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(processedScores).map(([key, score]) => {
                const label = SCORE_LABELS[key as keyof typeof SCORE_LABELS] || key;
                return (
                  <ScoreCard
                    key={key}
                    label={label}
                    value={score.value}
                    justification={score.justification}
                    source={score.source}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Evidence */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Evidence Trail
          </h2>

          {problem.evidenceSummary && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Summary:</strong> {problem.evidenceSummary}
              </p>
            </div>
          )}

          {problem.evidenceItems && problem.evidenceItems.length > 0 ? (
            <div className="space-y-4">
              {problem.evidenceItems.map((item, index) => (
                <EvidenceCard key={item.id || index} evidence={item as EvidenceItem} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No evidence items recorded.
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Metadata
          </h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Source</dt>
              <dd className="font-medium text-gray-900 dark:text-white">{problem.source || 'Unknown'}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Created</dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {new Date(problem.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="font-medium text-gray-900 dark:text-white">{problem.status || 'DISCOVERED'}</dd>
            </div>
            {problem.sprintId && (
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Sprint ID</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{problem.sprintId}</dd>
              </div>
            )}
            {problem.priorityScore != null && (
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Priority Score</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{problem.priorityScore.toFixed(1)}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comments {comments.length > 0 && <span className="text-sm font-normal text-gray-500">({comments.length})</span>}
          </h2>

          {/* Add Comment Form */}
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || submittingComment}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  {/* User Avatar */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-medium">
                    {(comment.user.firstName?.[0] || comment.user.email?.[0] || '?').toUpperCase()}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {comment.user.firstName && comment.user.lastName
                          ? `${comment.user.firstName} ${comment.user.lastName}`
                          : comment.user.email}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {editingCommentId === comment.id ? (
                      <div>
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleUpdateComment(comment.id)}
                            className="px-3 py-1 bg-primary-500 text-white rounded text-xs font-medium hover:bg-primary-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => { setEditingCommentId(null); setEditingContent(''); }}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                          {comment.content}
                        </p>

                        {/* Edit/Delete for own comments */}
                        {currentUser && currentUser.id === comment.user.id && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => startEditingComment(comment)}
                              className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
              No comments yet. Be the first to add one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// === Sub-components ===

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    DISCOVERED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    SHORTLISTED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    BACKLOG: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    IN_PROGRESS: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    SOLVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    DISCARDED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  const labels: Record<string, string> = {
    DISCOVERED: 'Discovered',
    SHORTLISTED: 'Shortlisted',
    BACKLOG: 'Backlog',
    IN_PROGRESS: 'In Progress',
    SOLVED: 'Solved',
    DISCARDED: 'Discarded',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[status] || colors.DISCOVERED}`}>
      {labels[status] || status}
    </span>
  );
}

function ScoreCard({
  label,
  value,
  justification,
  source,
}: {
  label: string;
  value: number;
  justification?: string;
  source?: string;
}) {
  const getColor = (v: number) => {
    if (v >= 70) return 'bg-green-500';
    if (v >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="flex items-center gap-2">
          {source && (
            <span className="text-xs text-gray-400">
              {source === 'AI' ? '🤖' : '👤'}
            </span>
          )}
          <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
        </div>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {justification && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{justification}</p>
      )}
    </div>
  );
}

function EvidenceCard({ evidence }: { evidence: EvidenceItem }) {
  const typeColors: Record<string, string> = {
    INTERVIEW_QUOTE: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20',
    SURVEY_RESPONSE: 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20',
    ANALYTICS_DATA: 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20',
    MARKET_RESEARCH: 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20',
    SYNTHETIC_INTERVIEW: 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800',
    COMPETITOR_INTEL: 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20',
  };

  const typeLabels: Record<string, string> = {
    INTERVIEW_QUOTE: 'Interview Quote',
    SURVEY_RESPONSE: 'Survey Response',
    ANALYTICS_DATA: 'Analytics Data',
    MARKET_RESEARCH: 'Market Research',
    SYNTHETIC_INTERVIEW: 'Synthetic Interview',
    COMPETITOR_INTEL: 'Competitor Intel',
    EXPERT_OPINION: 'Expert Opinion',
    SUPPORT_TICKET: 'Support Ticket',
    OBSERVATION: 'Observation',
    OTHER: 'Other',
  };

  const sentimentIcons: Record<string, string> = {
    POSITIVE: '😊',
    NEGATIVE: '😟',
    NEUTRAL: '😐',
  };

  return (
    <div
      className={`p-4 border-l-4 rounded-r-lg ${typeColors[evidence.type] || 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {typeLabels[evidence.type] || evidence.type}
        </span>
        {evidence.sentiment && (
          <span title={evidence.sentiment}>
            {sentimentIcons[evidence.sentiment]}
          </span>
        )}
      </div>
      <p className="text-gray-800 dark:text-gray-200 text-sm italic">
        "{evidence.content}"
      </p>
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {evidence.source && <span>Source: {evidence.source}</span>}
        {evidence.reportedBy && <span>By: {evidence.reportedBy}</span>}
        {evidence.reportedAt && (
          <span>{new Date(evidence.reportedAt).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function StarIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}
