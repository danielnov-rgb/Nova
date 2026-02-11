'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { pluginApi, type AnalyticsStats } from '../_lib/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const data = await pluginApi.getAnalytics(days);
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [days]);

  const maxDayCount = stats?.eventsByDay
    ? Math.max(...stats.eventsByDay.map((d) => d.count), 1)
    : 1;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track feature usage and engagement
            </p>
          </div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            Loading analytics...
          </div>
        ) : !stats ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            No analytics data available
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Events"
                value={stats.totalEvents.toLocaleString()}
                subtext={`Last ${days} days`}
              />
              <StatCard
                label="Feature Views"
                value={(stats.eventsByType['FEATURE_VIEW'] || 0).toLocaleString()}
                subtext="FEATURE_VIEW events"
              />
              <StatCard
                label="Interactions"
                value={(stats.eventsByType['FEATURE_INTERACT'] || 0).toLocaleString()}
                subtext="FEATURE_INTERACT events"
              />
              <StatCard
                label="Completions"
                value={(stats.eventsByType['FEATURE_COMPLETE'] || 0).toLocaleString()}
                subtext="FEATURE_COMPLETE events"
              />
            </div>

            {/* Events by Day Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Events Over Time
              </h2>

              {stats.eventsByDay.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No event data for this period
                </div>
              ) : (
                <div className="flex items-end gap-1 h-48">
                  {stats.eventsByDay.map((day) => (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-full bg-primary-500 rounded-t transition-all"
                        style={{
                          height: `${(day.count / maxDayCount) * 100}%`,
                          minHeight: day.count > 0 ? '4px' : '0',
                        }}
                        title={`${day.date}: ${day.count} events`}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400 -rotate-45 origin-top-left w-12 truncate">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Events by Type */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Events by Type
                </h2>

                {Object.keys(stats.eventsByType).length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No events recorded
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(stats.eventsByType)
                      .sort((a, b) => b[1] - a[1])
                      .map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                            {type}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Top Features */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Top Features
                </h2>

                {stats.topFeatures.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No feature events recorded
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.topFeatures.map((feature, index) => (
                      <Link
                        key={feature.featureId}
                        href={`/admin/features?search=${feature.featureId}`}
                        className="flex items-center justify-between p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400 w-5">
                            {index + 1}.
                          </span>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {feature.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              {feature.featureId}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {feature.count.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Empty State */}
            {stats.totalEvents === 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <ChartIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No events yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Install the Nova plugin in your application to start tracking feature usage.
                </p>
                <Link
                  href="/admin/plugin"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View installation instructions
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
        {value}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtext}</div>
    </div>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}
