'use client';

import { useState } from 'react';
import { SyntheticUser } from '../../_lib/types/synthetic-user';
import PersonaCard from './PersonaCard';
import PersonaModal from './PersonaModal';

interface PersonaGridProps {
  personas: SyntheticUser[];
  loading?: boolean;
}

/**
 * Loading skeleton for persona cards
 */
function PersonaCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
      <div className="mt-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
      </div>
    </div>
  );
}

/**
 * Empty state when no personas match filters
 */
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
        No personas found
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        Try adjusting your filters to see more results, or clear all filters to see the full library.
      </p>
    </div>
  );
}

export default function PersonaGrid({ personas, loading = false }: PersonaGridProps) {
  const [selectedPersona, setSelectedPersona] = useState<SyntheticUser | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PersonaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (personas.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            onClick={() => setSelectedPersona(persona)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedPersona && (
        <PersonaModal
          persona={selectedPersona}
          isOpen={!!selectedPersona}
          onClose={() => setSelectedPersona(null)}
        />
      )}
    </>
  );
}
