'use client';

import { useState } from 'react';
import {
  AgeRange,
  IncomeRange,
  SmokingStatus,
  TechSavviness,
  getDemographicLabel,
} from '../../_lib/types/demographics';

export interface FilterOption {
  value: string;
  label: string;
}

export interface PersonaFiltersState {
  professions: string[];
  industries: string[];
  cities: string[];
  townships: string[];
  ageRanges: AgeRange[];
  incomeRanges: IncomeRange[];
  smokingStatuses: SmokingStatus[];
  techLevels: TechSavviness[];
  search: string;
}

interface PersonaFiltersProps {
  filters: PersonaFiltersState;
  onFiltersChange: (filters: PersonaFiltersState) => void;
  options: {
    professions: FilterOption[];
    industries: FilterOption[];
    cities: FilterOption[];
    townships: FilterOption[];
  };
  totalCount: number;
  filteredCount: number;
}

/**
 * Collapsible filter section
 */
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

/**
 * Checkbox filter item
 */
function CheckboxItem({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
      />
      <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 flex-1">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-gray-400 dark:text-gray-500">{count}</span>
      )}
    </label>
  );
}

export default function PersonaFilters({
  filters,
  onFiltersChange,
  options,
  totalCount,
  filteredCount,
}: PersonaFiltersProps) {
  const handleToggle = <K extends keyof PersonaFiltersState>(
    key: K,
    value: PersonaFiltersState[K] extends string[] ? string : never
  ) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    onFiltersChange({ ...filters, [key]: newArray });
  };

  const handleClearAll = () => {
    onFiltersChange({
      professions: [],
      industries: [],
      cities: [],
      townships: [],
      ageRanges: [],
      incomeRanges: [],
      smokingStatuses: [],
      techLevels: [],
      search: '',
    });
  };

  const hasActiveFilters =
    filters.professions.length > 0 ||
    filters.industries.length > 0 ||
    filters.cities.length > 0 ||
    filters.townships.length > 0 ||
    filters.ageRanges.length > 0 ||
    filters.incomeRanges.length > 0 ||
    filters.smokingStatuses.length > 0 ||
    filters.techLevels.length > 0 ||
    filters.search.length > 0;

  const ageRangeOptions: AgeRange[] = [
    'RANGE_18_24',
    'RANGE_25_34',
    'RANGE_35_44',
    'RANGE_45_54',
    'RANGE_55_64',
    'RANGE_65_PLUS',
  ];

  const incomeRangeOptions: IncomeRange[] = [
    'UNDER_25K',
    'RANGE_25K_50K',
    'RANGE_50K_75K',
    'RANGE_75K_100K',
    'RANGE_100K_150K',
    'RANGE_150K_200K',
    'RANGE_200K_300K',
    'OVER_300K',
  ];

  const smokingOptions: SmokingStatus[] = [
    'NEVER',
    'FORMER',
    'OCCASIONAL',
    'REGULAR',
    'HEAVY',
  ];

  const techOptions: TechSavviness[] = [
    'NOVICE',
    'BASIC',
    'INTERMEDIATE',
    'ADVANCED',
    'EXPERT',
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search personas..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-900 dark:text-white">{filteredCount}</span> of{' '}
        <span className="font-medium text-gray-900 dark:text-white">{totalCount}</span> personas
      </div>

      {/* Filter sections */}
      <FilterSection title="Profession">
        {options.professions.map((opt) => (
          <CheckboxItem
            key={opt.value}
            label={opt.label}
            checked={filters.professions.includes(opt.value)}
            onChange={() => handleToggle('professions', opt.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Industry" defaultOpen={false}>
        {options.industries.map((opt) => (
          <CheckboxItem
            key={opt.value}
            label={opt.label}
            checked={filters.industries.includes(opt.value)}
            onChange={() => handleToggle('industries', opt.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Location" defaultOpen={false}>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Cities</div>
        {options.cities.map((opt) => (
          <CheckboxItem
            key={opt.value}
            label={opt.label}
            checked={filters.cities.includes(opt.value)}
            onChange={() => handleToggle('cities', opt.value)}
          />
        ))}
        {options.townships.length > 0 && (
          <>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 mb-2">
              Townships
            </div>
            {options.townships.map((opt) => (
              <CheckboxItem
                key={opt.value}
                label={opt.label}
                checked={filters.townships.includes(opt.value)}
                onChange={() => handleToggle('townships', opt.value)}
              />
            ))}
          </>
        )}
      </FilterSection>

      <FilterSection title="Age Range" defaultOpen={false}>
        {ageRangeOptions.map((range) => (
          <CheckboxItem
            key={range}
            label={getDemographicLabel('ageRange', range)}
            checked={filters.ageRanges.includes(range)}
            onChange={(checked) => {
              const newRanges = checked
                ? [...filters.ageRanges, range]
                : filters.ageRanges.filter((r) => r !== range);
              onFiltersChange({ ...filters, ageRanges: newRanges });
            }}
          />
        ))}
      </FilterSection>

      <FilterSection title="Income Range" defaultOpen={false}>
        {incomeRangeOptions.map((range) => (
          <CheckboxItem
            key={range}
            label={getDemographicLabel('incomeRange', range)}
            checked={filters.incomeRanges.includes(range)}
            onChange={(checked) => {
              const newRanges = checked
                ? [...filters.incomeRanges, range]
                : filters.incomeRanges.filter((r) => r !== range);
              onFiltersChange({ ...filters, incomeRanges: newRanges });
            }}
          />
        ))}
      </FilterSection>

      <FilterSection title="Smoking Status" defaultOpen={false}>
        {smokingOptions.map((status) => (
          <CheckboxItem
            key={status}
            label={getDemographicLabel('smokingStatus', status)}
            checked={filters.smokingStatuses.includes(status)}
            onChange={(checked) => {
              const newStatuses = checked
                ? [...filters.smokingStatuses, status]
                : filters.smokingStatuses.filter((s) => s !== status);
              onFiltersChange({ ...filters, smokingStatuses: newStatuses });
            }}
          />
        ))}
      </FilterSection>

      <FilterSection title="Tech Savviness" defaultOpen={false}>
        {techOptions.map((level) => (
          <CheckboxItem
            key={level}
            label={getDemographicLabel('techSavviness', level)}
            checked={filters.techLevels.includes(level)}
            onChange={(checked) => {
              const newLevels = checked
                ? [...filters.techLevels, level]
                : filters.techLevels.filter((l) => l !== level);
              onFiltersChange({ ...filters, techLevels: newLevels });
            }}
          />
        ))}
      </FilterSection>
    </div>
  );
}
