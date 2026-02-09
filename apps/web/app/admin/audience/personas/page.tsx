'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { samplePersonas, getFilterOptions } from '../_data/sample-personas';
import { SyntheticUser } from '../../_lib/types/synthetic-user';
import PersonaFilters, { PersonaFiltersState } from '../_components/PersonaFilters';
import PersonaGrid from '../_components/PersonaGrid';

/**
 * Apply filters to persona list
 */
function applyFilters(
  personas: SyntheticUser[],
  filters: PersonaFiltersState
): SyntheticUser[] {
  return personas.filter((persona) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableText = [
        persona.firstName,
        persona.lastName,
        persona.profession,
        persona.city,
        persona.bio,
        persona.industry,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!searchableText.includes(searchLower)) return false;
    }

    // Profession filter
    if (
      filters.professions.length > 0 &&
      (!persona.profession || !filters.professions.includes(persona.profession))
    ) {
      return false;
    }

    // Industry filter
    if (
      filters.industries.length > 0 &&
      (!persona.industry || !filters.industries.includes(persona.industry))
    ) {
      return false;
    }

    // City filter
    if (
      filters.cities.length > 0 &&
      (!persona.city || !filters.cities.includes(persona.city))
    ) {
      return false;
    }

    // Township filter
    if (
      filters.townships.length > 0 &&
      (!persona.township || !filters.townships.includes(persona.township))
    ) {
      return false;
    }

    // Age range filter
    if (
      filters.ageRanges.length > 0 &&
      !filters.ageRanges.includes(persona.ageRange)
    ) {
      return false;
    }

    // Income range filter
    if (
      filters.incomeRanges.length > 0 &&
      (!persona.incomeRange || !filters.incomeRanges.includes(persona.incomeRange))
    ) {
      return false;
    }

    // Smoking status filter
    if (
      filters.smokingStatuses.length > 0 &&
      (!persona.smokingStatus ||
        !filters.smokingStatuses.includes(persona.smokingStatus))
    ) {
      return false;
    }

    // Tech savviness filter
    if (
      filters.techLevels.length > 0 &&
      (!persona.techSavviness || !filters.techLevels.includes(persona.techSavviness))
    ) {
      return false;
    }

    return true;
  });
}

export default function PersonaLibraryPage() {
  const [filters, setFilters] = useState<PersonaFiltersState>({
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

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get filter options from sample data
  const filterOptions = useMemo(() => getFilterOptions(), []);

  // Apply filters to personas
  const filteredPersonas = useMemo(
    () => applyFilters(samplePersonas, filters),
    [filters]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/admin/audience"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Audience
              </Link>
              <span className="text-gray-400">/</span>
              <span className="font-medium text-gray-900 dark:text-white">
                Persona Library
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </button>

              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Generate Personas
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop filters sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <PersonaFilters
                filters={filters}
                onFiltersChange={setFilters}
                options={filterOptions}
                totalCount={samplePersonas.length}
                filteredCount={filteredPersonas.length}
              />
            </div>
          </aside>

          {/* Mobile filters drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="absolute left-0 top-0 h-full w-80 max-w-full bg-white dark:bg-gray-800 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <PersonaFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    options={filterOptions}
                    totalCount={samplePersonas.length}
                    filteredCount={filteredPersonas.length}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Grid content */}
          <main className="flex-1 min-w-0">
            {/* Page title and stats */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Persona Library
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Browse and filter synthetic user personas for research and analysis.
              </p>
            </div>

            {/* Active filters summary */}
            {(filters.professions.length > 0 ||
              filters.industries.length > 0 ||
              filters.cities.length > 0 ||
              filters.townships.length > 0 ||
              filters.ageRanges.length > 0 ||
              filters.incomeRanges.length > 0 ||
              filters.smokingStatuses.length > 0 ||
              filters.techLevels.length > 0) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {filters.professions.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                  >
                    {p}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          professions: filters.professions.filter((x) => x !== p),
                        })
                      }
                      className="ml-1 hover:text-primary-600"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {filters.industries.map((i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {i}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          industries: filters.industries.filter((x) => x !== i),
                        })
                      }
                      className="ml-1 hover:text-blue-600"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {filters.cities.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  >
                    {c}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          cities: filters.cities.filter((x) => x !== c),
                        })
                      }
                      className="ml-1 hover:text-green-600"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {filters.townships.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  >
                    {t}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          townships: filters.townships.filter((x) => x !== t),
                        })
                      }
                      className="ml-1 hover:text-amber-600"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Persona grid */}
            <PersonaGrid personas={filteredPersonas} />

            {/* Pagination placeholder */}
            {filteredPersonas.length > 0 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredPersonas.length} of {samplePersonas.length} personas
                </p>
                {/* Future: Add pagination controls when API integration is added */}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
