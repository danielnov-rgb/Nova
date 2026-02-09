"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { audienceApi, TargetAudience, TargetAudienceType } from "../_lib/api";
import { samplePersonas } from "./_data/sample-personas";
import { sampleAudiences, EnhancedAudience } from "./_data/sample-audiences";
import { SyntheticUser } from "../_lib/types/synthetic-user";
import PersonaCard from "./_components/PersonaCard";
import PersonaModal from "./_components/PersonaModal";
import { DemographicComparisonDashboard, AudienceOverview } from "./_components/DemographicCharts";

const TYPE_LABELS: Record<TargetAudienceType, string> = {
  EXISTING: "Current Customers",
  TARGET: "Target Acquisition",
  MARKET: "Market Demographics",
};

const TYPE_COLORS: Record<TargetAudienceType, string> = {
  EXISTING: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  TARGET: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  MARKET: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function AudiencePage() {
  const [audiences, setAudiences] = useState<TargetAudience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<TargetAudienceType | "">("");
  const [selectedPersona, setSelectedPersona] = useState<SyntheticUser | null>(null);
  const [usingSampleData, setUsingSampleData] = useState(false);

  // Get first 8 personas for preview
  const previewPersonas = samplePersonas.slice(0, 8);

  // Get enhanced sample audiences for charts (always use sample data for charts)
  const filteredEnhancedAudiences = filterType
    ? sampleAudiences.filter(a => a.type === filterType)
    : sampleAudiences;

  useEffect(() => {
    fetchAudiences();
  }, [filterType]);

  async function fetchAudiences() {
    try {
      setLoading(true);
      setError(null);
      const data = await audienceApi.list(filterType || undefined);

      // If API returns empty, use sample data
      if (data.length === 0) {
        setUsingSampleData(true);
        setAudiences([]);
      } else {
        setAudiences(data);
        setUsingSampleData(false);
      }
    } catch (err) {
      // On API error, fall back to sample data
      console.log("API unavailable, using sample data");
      setUsingSampleData(true);
      setAudiences([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this audience segment?")) return;

    try {
      await audienceApi.delete(id);
      setAudiences((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete audience");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Target Audience
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Define who you're building for and understand your market
            </p>
          </div>
          <Link
            href="/admin/audience/new"
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            Add Audience
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {usingSampleData && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3">
            <InfoIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              Showing sample audience data for demo purposes. Connect to API to see real data.
            </p>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === ""
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            {(Object.keys(TYPE_LABELS) as TargetAudienceType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Demographic Comparison Dashboard */}
        {usingSampleData && filteredEnhancedAudiences.length > 0 && (
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Demographic Comparison
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Compare demographics across existing customers, target acquisition, and market reality
              </p>
            </div>
            <DemographicComparisonDashboard audiences={filteredEnhancedAudiences} />
          </div>
        )}

        {/* Audience Grid - Show when we have real API data */}
        {!usingSampleData && audiences.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No audience segments yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start by defining your target audience segments
            </p>
            <Link
              href="/admin/audience/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Audience
            </Link>
          </div>
        )}

        {!usingSampleData && audiences.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {audiences.map((audience) => (
              <AudienceCard
                key={audience.id}
                audience={audience}
                onDelete={() => handleDelete(audience.id)}
              />
            ))}
          </div>
        )}

        {/* Persona Preview Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Synthetic User Personas
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                AI-generated personas reflecting real demographic distributions
              </p>
            </div>
            <Link
              href="/admin/audience/personas"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
            >
              View All Personas
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {/* Persona Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {previewPersonas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                onClick={() => setSelectedPersona(persona)}
              />
            ))}
          </div>

          {/* View More Link */}
          <div className="mt-6 text-center">
            <Link
              href="/admin/audience/personas"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <span>Showing {previewPersonas.length} of {samplePersonas.length} personas</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Persona Modal */}
      {selectedPersona && (
        <PersonaModal
          persona={selectedPersona}
          isOpen={!!selectedPersona}
          onClose={() => setSelectedPersona(null)}
        />
      )}
    </div>
  );
}

function AudienceCard({
  audience,
  onDelete,
}: {
  audience: TargetAudience;
  onDelete: () => void;
}) {
  const segmentCount = audience.segments?.length || 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              TYPE_COLORS[audience.type]
            }`}
          >
            {TYPE_LABELS[audience.type]}
          </span>
        </div>
        <div className="flex gap-1">
          <Link
            href={`/admin/audience/${audience.id}`}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <EditIcon className="w-4 h-4" />
          </Link>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {audience.name}
      </h3>

      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span>{segmentCount} segment{segmentCount !== 1 ? "s" : ""}</span>
      </div>

      {segmentCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap gap-2">
            {audience.segments.slice(0, 3).map((segment, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
              >
                {segment.name}
              </span>
            ))}
            {segmentCount > 3 && (
              <span className="px-2 py-1 text-xs text-gray-500">
                +{segmentCount - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
