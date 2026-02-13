'use client';

import { WeightValues, SCORE_LABELS, DEFAULT_WEIGHTS } from '../../_lib/types/problem';

interface WeightingSlidersProps {
  weights: WeightValues;
  enabledAttributes: Set<keyof WeightValues>;
  onChange: (weights: WeightValues) => void;
  onToggleAttribute: (key: keyof WeightValues) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const WEIGHT_GROUPS = {
  core: {
    label: 'Core Impact',
    keys: ['applicability', 'severity', 'frequency', 'willingnessToPay'] as const,
    color: 'bg-blue-500',
  },
  strategic: {
    label: 'Strategic Value',
    keys: ['retentionImpact', 'acquisitionPotential', 'viralCoefficient', 'strategicFit'] as const,
    color: 'bg-purple-500',
  },
  execution: {
    label: 'Execution',
    keys: ['feasibility', 'timeToValue', 'riskLevel'] as const,
    color: 'bg-green-500',
  },
};

export function WeightingSliders({
  weights,
  enabledAttributes,
  onChange,
  onToggleAttribute,
  collapsed = false,
  onToggleCollapse,
}: WeightingSlidersProps) {
  // Only count enabled attributes
  const enabledTotal = Array.from(enabledAttributes).reduce(
    (sum, key) => sum + weights[key],
    0
  );
  const isValid = enabledTotal === 100;

  function handleChange(key: keyof WeightValues, value: number) {
    onChange({ ...weights, [key]: value });
  }

  function handleReset() {
    onChange(DEFAULT_WEIGHTS);
  }

  function handleNormalize() {
    if (enabledTotal === 0) return;
    const factor = 100 / enabledTotal;
    const normalized = { ...weights };
    for (const key of enabledAttributes) {
      normalized[key] = Math.round(weights[key] * factor);
    }
    // Adjust for rounding errors
    const newTotal = Array.from(enabledAttributes).reduce(
      (sum, key) => sum + normalized[key],
      0
    );
    if (newTotal !== 100 && enabledAttributes.size > 0) {
      const firstKey = Array.from(enabledAttributes)[0];
      normalized[firstKey] += 100 - newTotal;
    }
    onChange(normalized);
  }

  if (collapsed) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-between text-left"
        >
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Weighting Profile</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {enabledAttributes.size} attributes enabled
            </p>
          </div>
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Weighting Profile</h3>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              isValid
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
            }`}
          >
            {enabledAttributes.size} enabled • {enabledTotal}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNormalize}
            disabled={isValid || enabledTotal === 0}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Normalize to 100%
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Reset
          </button>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ChevronUpIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Toggle which attributes to include in priority scoring. Only enabled attributes contribute to the final score.
      </p>

      <div className="space-y-6">
        {Object.entries(WEIGHT_GROUPS).map(([groupKey, group]) => {
          const groupEnabled = group.keys.filter((k) => enabledAttributes.has(k));
          const groupTotal = groupEnabled.reduce((sum, key) => sum + weights[key], 0);

          return (
            <div key={groupKey}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${group.color}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {group.label}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({groupEnabled.length}/{group.keys.length} enabled • {groupTotal}%)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {group.keys.map((key) => (
                  <WeightSlider
                    key={key}
                    label={SCORE_LABELS[key]}
                    value={weights[key]}
                    enabled={enabledAttributes.has(key)}
                    onToggle={() => onToggleAttribute(key)}
                    onChange={(value) => handleChange(key, value)}
                    color={group.color}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface WeightSliderProps {
  label: string;
  value: number;
  enabled: boolean;
  onToggle: () => void;
  onChange: (value: number) => void;
  color: string;
}

function WeightSlider({ label, value, enabled, onToggle, onChange, color }: WeightSliderProps) {
  const getScoreBadgeColor = (v: number) => {
    if (v >= 20) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (v >= 10) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
    if (v >= 5) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  };

  return (
    <div
      className={`p-3 rounded-lg border transition-all duration-300 ${
        enabled
          ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
          : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 opacity-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
          <input
            type="checkbox"
            checked={enabled}
            onChange={onToggle}
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 transition-colors"
          />
          <span
            className={`text-xs font-medium truncate transition-colors ${
              enabled
                ? 'text-gray-700 dark:text-gray-300'
                : 'text-gray-400 dark:text-gray-500'
            }`}
            title={label}
          >
            {label}
          </span>
        </label>
        {enabled && (
          <span className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${getScoreBadgeColor(value)}`}>
            {value}%
          </span>
        )}
      </div>
      {enabled && (
        <div className="relative group">
          <input
            type="range"
            min={0}
            max={30}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer transition-all
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-gray-300
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-gray-300
              [&::-moz-range-thumb]:shadow-md
              [&::-moz-range-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${getColorValue(color)} 0%, ${getColorValue(color)} ${(value / 30) * 100}%, rgb(229, 231, 235) ${(value / 30) * 100}%)`,
            }}
          />
          {/* Quick adjust buttons */}
          <div className="absolute -bottom-1 left-0 right-0 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={() => onChange(Math.max(0, value - 5))}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-1"
              type="button"
            >
              -5
            </button>
            <button
              onClick={() => onChange(Math.min(30, value + 5))}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-1"
              type="button"
            >
              +5
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getColorValue(colorClass: string): string {
  const colorMap: Record<string, string> = {
    'bg-blue-500': 'rgb(59, 130, 246)',
    'bg-purple-500': 'rgb(168, 85, 247)',
    'bg-green-500': 'rgb(34, 197, 94)',
  };
  return colorMap[colorClass] || 'rgb(59, 130, 246)';
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );
}

export default WeightingSliders;
