'use client';

import { useState } from 'react';
import type { EnhancedAudience } from '../_data/sample-audiences';
import { getAggregatedDemographics, compareDemographics } from '../_data/sample-audiences';

type DemographicDimension = 'age' | 'gender' | 'income' | 'location' | 'education' | 'employment';

const DIMENSION_LABELS: Record<DemographicDimension, string> = {
  age: 'Age Distribution',
  gender: 'Gender Distribution',
  income: 'Income Levels',
  location: 'Geographic Distribution',
  education: 'Education Levels',
  employment: 'Employment Status',
};

const TYPE_COLORS = {
  EXISTING: {
    bg: 'bg-green-500',
    text: 'text-green-600',
    light: 'bg-green-100 dark:bg-green-900/30',
  },
  TARGET: {
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    light: 'bg-blue-100 dark:bg-blue-900/30',
  },
  MARKET: {
    bg: 'bg-purple-500',
    text: 'text-purple-600',
    light: 'bg-purple-100 dark:bg-purple-900/30',
  },
};

interface BarChartProps {
  data: Record<string, number>;
  color?: string;
  maxValue?: number;
  showLabels?: boolean;
}

/**
 * Simple horizontal bar chart
 */
function BarChart({ data, color = 'bg-primary-500', maxValue, showLabels = true }: BarChartProps) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = maxValue || Math.max(...entries.map(([, v]) => v));

  return (
    <div className="space-y-2">
      {entries.map(([label, value]) => (
        <div key={label} className="flex items-center gap-3">
          {showLabels && (
            <span className="text-xs text-gray-600 dark:text-gray-400 w-24 truncate" title={label}>
              {label}
            </span>
          )}
          <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} rounded-full transition-all duration-500 flex items-center justify-end px-2`}
              style={{ width: `${Math.max((value / max) * 100, 2)}%` }}
            >
              <span className="text-xs font-medium text-white">
                {value.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ComparisonChartProps {
  dimension: DemographicDimension;
}

/**
 * Side-by-side comparison chart for all audience types
 */
function ComparisonChart({ dimension }: ComparisonChartProps) {
  const comparisonData = compareDemographics(dimension);

  // Get all unique labels across all audiences
  const allLabels = new Set<string>();
  comparisonData.forEach((audience) => {
    Object.keys(audience.data).forEach((label) => allLabels.add(label));
  });
  const labels = Array.from(allLabels);

  // Order labels appropriately
  const orderedLabels = dimension === 'age'
    ? ['18-24', '25-34', '35-44', '45-54', '55+']
    : dimension === 'income'
    ? ['Under R25K', 'R25K-R50K', 'R50K-R75K', 'R75K-R100K', 'R100K+']
    : labels;

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {comparisonData.map((audience) => (
          <div key={audience.type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${TYPE_COLORS[audience.type].bg}`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {audience.type === 'EXISTING' ? 'Current' : audience.type === 'TARGET' ? 'Target' : 'Market'}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="space-y-3">
        {orderedLabels.filter(label => labels.includes(label)).map((label) => (
          <div key={label} className="space-y-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
            <div className="flex gap-1 h-6">
              {comparisonData.map((audience) => {
                const value = audience.data[label] || 0;
                return (
                  <div
                    key={audience.type}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden"
                  >
                    <div
                      className={`h-full ${TYPE_COLORS[audience.type].bg} transition-all duration-500 flex items-center justify-center`}
                      style={{ width: `${value}%` }}
                      title={`${audience.name}: ${value.toFixed(1)}%`}
                    >
                      {value > 10 && (
                        <span className="text-[10px] font-medium text-white">
                          {value.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AudienceOverviewProps {
  audience: EnhancedAudience;
}

/**
 * Overview card for a single audience
 */
export function AudienceOverview({ audience }: AudienceOverviewProps) {
  const aggregated = getAggregatedDemographics(audience);
  const colors = TYPE_COLORS[audience.type];

  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${colors.light}`}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{audience.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{audience.description}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${colors.text}`}>
              {audience.totalSize.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Size</p>
          </div>
        </div>

        {/* Segment breakdown */}
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Segments
          </h4>
          <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
            {audience.segments.map((segment, idx) => (
              <div
                key={segment.name}
                className={`${colors.bg} flex items-center justify-center transition-all hover:opacity-80`}
                style={{ width: `${segment.percentage}%`, opacity: 1 - idx * 0.2 }}
                title={`${segment.name}: ${segment.percentage}%`}
              >
                {segment.percentage > 15 && (
                  <span className="text-xs font-medium text-white">{segment.percentage}%</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {audience.segments.map((segment, idx) => (
              <span
                key={segment.name}
                className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1"
              >
                <span
                  className={`w-2 h-2 rounded-full ${colors.bg}`}
                  style={{ opacity: 1 - idx * 0.2 }}
                />
                {segment.name}
              </span>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {audience.summaryStats.avgAge}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Age</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              R{(audience.summaryStats.avgIncome / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Income</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {audience.segments.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Segments</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DemographicComparisonDashboardProps {
  audiences: EnhancedAudience[];
}

/**
 * Full dashboard with dimension selector and comparison charts
 */
export function DemographicComparisonDashboard({ audiences }: DemographicComparisonDashboardProps) {
  const [selectedDimension, setSelectedDimension] = useState<DemographicDimension>('age');

  const dimensions: DemographicDimension[] = ['age', 'gender', 'income', 'location', 'education', 'employment'];

  return (
    <div className="space-y-6">
      {/* Dimension selector */}
      <div className="flex flex-wrap gap-2">
        {dimensions.map((dim) => (
          <button
            key={dim}
            onClick={() => setSelectedDimension(dim)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDimension === dim
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {DIMENSION_LABELS[dim]}
          </button>
        ))}
      </div>

      {/* Comparison chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {DIMENSION_LABELS[selectedDimension]} Comparison
        </h3>
        <ComparisonChart dimension={selectedDimension} />
      </div>

      {/* Individual audience cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {audiences.map((audience) => (
          <AudienceOverview key={audience.id} audience={audience} />
        ))}
      </div>
    </div>
  );
}

interface SegmentDetailChartProps {
  audience: EnhancedAudience;
  segmentIndex: number;
}

/**
 * Detailed charts for a specific segment
 */
export function SegmentDetailChart({ audience, segmentIndex }: SegmentDetailChartProps) {
  const segment = audience.segments[segmentIndex];
  if (!segment) return null;

  const colors = TYPE_COLORS[audience.type];

  const charts = [
    { key: 'age', label: 'Age', data: segment.demographics.ageDistribution.reduce((acc, d) => ({ ...acc, [d.range]: d.percentage }), {}) },
    { key: 'gender', label: 'Gender', data: segment.demographics.genderDistribution.reduce((acc, d) => ({ ...acc, [d.gender]: d.percentage }), {}) },
    { key: 'income', label: 'Income', data: segment.demographics.incomeDistribution.reduce((acc, d) => ({ ...acc, [d.range]: d.percentage }), {}) },
    { key: 'location', label: 'Location', data: segment.demographics.locationDistribution.reduce((acc, d) => ({ ...acc, [d.location]: d.percentage }), {}) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full ${colors.bg}`} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{segment.name}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {segment.size.toLocaleString()} ({segment.percentage}%)
        </span>
      </div>

      {segment.description && (
        <p className="text-gray-600 dark:text-gray-400">{segment.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charts.map((chart) => (
          <div key={chart.key} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{chart.label}</h4>
            <BarChart data={chart.data} color={colors.bg} />
          </div>
        ))}
      </div>

      {/* Characteristics */}
      {segment.keyCharacteristics && segment.keyCharacteristics.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Key Characteristics</h4>
          <div className="flex flex-wrap gap-2">
            {segment.keyCharacteristics.map((char) => (
              <span
                key={char}
                className={`px-3 py-1 rounded-full text-xs font-medium ${colors.light} ${colors.text}`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { BarChart, ComparisonChart };
