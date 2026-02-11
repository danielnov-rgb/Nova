'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { problemsApi } from '../../_lib/api';
import { Problem } from '../../_lib/types';
import { SCORE_LABELS, EvidenceItem } from '../../_lib/types/problem';

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
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {problem.title}
              </h1>
            </div>
            <Link
              href={`/admin/problems/${problem.id}/edit`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Edit
            </Link>
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
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
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
