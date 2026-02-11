'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { featuresApi, type Feature, type FeatureStatus } from '../_lib/api';

const STATUS_COLORS: Record<FeatureStatus, { bg: string; text: string }> = {
  DRAFT: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' },
  ACTIVE: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  DEPRECATED: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  ARCHIVED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
};

export default function FeaturesPage() {
  const router = useRouter();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FeatureStatus | ''>('');
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');

  useEffect(() => {
    async function fetchFeatures() {
      try {
        const data = viewMode === 'tree'
          ? await featuresApi.getTree()
          : await featuresApi.list({ rootOnly: viewMode === 'list' ? false : true });
        setFeatures(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load features');
      } finally {
        setLoading(false);
      }
    }
    fetchFeatures();
  }, [viewMode]);

  const filteredFeatures = useMemo(() => {
    let filtered = features;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.featureId.toLowerCase().includes(query) ||
          f.description?.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((f) => f.status === statusFilter);
    }

    return filtered;
  }, [features, searchQuery, statusFilter]);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Feature Map
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Catalog and track features in your product
            </p>
          </div>
          <Link
            href="/admin/features/new"
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Add Feature
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-t-xl border border-b-0 border-gray-200 dark:border-gray-800 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FeatureStatus | '')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="DEPRECATED">Deprecated</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'tree'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <TreeIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white dark:bg-gray-900 rounded-b-xl border border-t-0 border-gray-200 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
              Loading features...
            </div>
          ) : filteredFeatures.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
              {features.length === 0 ? (
                <div>
                  <p className="mb-2">No features documented yet</p>
                  <Link
                    href="/admin/features/new"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Create your first feature
                  </Link>
                </div>
              ) : (
                'No features match your filters'
              )}
            </div>
          ) : viewMode === 'list' ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredFeatures.map((feature) => (
                <FeatureListItem
                  key={feature.id}
                  feature={feature}
                  onClick={() => router.push(`/admin/features/${feature.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="p-4">
              {filteredFeatures.map((feature) => (
                <FeatureTreeItem
                  key={feature.id}
                  feature={feature}
                  level={0}
                  onNavigate={(id) => router.push(`/admin/features/${id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredFeatures.length} of {features.length} features
        </div>
      </div>
    </div>
  );
}

function FeatureListItem({
  feature,
  onClick,
}: {
  feature: Feature;
  onClick: () => void;
}) {
  const statusColors = STATUS_COLORS[feature.status];

  return (
    <div
      onClick={onClick}
      className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
              {feature.name}
            </h3>
            <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors.bg} ${statusColors.text}`}>
              {feature.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
            {feature.featureId}
          </p>
          {feature.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
              {feature.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 ml-4">
          {feature.tags.length > 0 && (
            <div className="hidden sm:flex gap-1">
              {feature.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {feature._count && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {feature._count.analyticsEvents} events
            </div>
          )}
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

function FeatureTreeItem({
  feature,
  level,
  onNavigate,
}: {
  feature: Feature;
  level: number;
  onNavigate: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = feature.children && feature.children.length > 0;
  const statusColors = STATUS_COLORS[feature.status];

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer"
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <ChevronIcon
              className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          </button>
        ) : (
          <span className="w-6" />
        )}
        <div
          className="flex-1 flex items-center gap-2"
          onClick={() => onNavigate(feature.id)}
        >
          <span className="text-gray-900 dark:text-white font-medium">
            {feature.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {feature.featureId}
          </span>
          <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors.bg} ${statusColors.text}`}>
            {feature.status}
          </span>
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {feature.children!.map((child) => (
            <FeatureTreeItem
              key={child.id}
              feature={child}
              level={level + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function TreeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
