"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { marketApi, MarketIntelligence, MarketIntelligenceCategory } from "../_lib/api";
import { sampleMarketData, getSampleDataByCategory } from "./_data/sample-market-data";
import { AgentPageHeader } from "../_components/AgentPageHeader";

const CATEGORY_LABELS: Record<MarketIntelligenceCategory, string> = {
  INDUSTRY: "Industry Trends",
  BENCHMARK: "Benchmarks",
  ECONOMIC: "Economic Indicators",
  PRICING: "Pricing Intelligence",
  DEMOGRAPHIC: "Demographics",
};

const CATEGORY_COLORS: Record<MarketIntelligenceCategory, string> = {
  INDUSTRY: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  BENCHMARK: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ECONOMIC: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PRICING: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DEMOGRAPHIC: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

export default function MarketPage() {
  const [items, setItems] = useState<MarketIntelligence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<MarketIntelligenceCategory | "">("");
  const [usingSampleData, setUsingSampleData] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [filterCategory]);

  async function fetchItems() {
    try {
      setLoading(true);
      setError(null);
      const data = await marketApi.list(filterCategory || undefined);

      // If API returns empty, use sample data
      if (data.length === 0) {
        const sampleData = getSampleDataByCategory(filterCategory || undefined);
        setItems(sampleData);
        setUsingSampleData(true);
      } else {
        setItems(data);
        setUsingSampleData(false);
      }
    } catch (err) {
      // On API error, fall back to sample data
      console.log("API unavailable, using sample data");
      const sampleData = getSampleDataByCategory(filterCategory || undefined);
      setItems(sampleData);
      setUsingSampleData(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    // If using sample data, just remove from local state
    if (usingSampleData) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    try {
      await marketApi.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
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
        <AgentPageHeader agentId="research" />
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Market Intelligence
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Industry data, benchmarks, and market insights
            </p>
          </div>
          <Link
            href="/admin/market/new"
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            Add Data Point
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
              Showing sample market data for demo purposes. Connect to API to see real data.
            </p>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory("")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCategory === ""
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            {(Object.keys(CATEGORY_LABELS) as MarketIntelligenceCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterCategory === cat
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Data Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <ChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No market data yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start tracking market intelligence and benchmarks
            </p>
            <Link
              href="/admin/market/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Data Point
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <DataCard
                key={item.id}
                item={item}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DataCard({
  item,
  onDelete,
}: {
  item: MarketIntelligence;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            CATEGORY_COLORS[item.category]
          }`}
        >
          {CATEGORY_LABELS[item.category]}
        </span>
        <div className="flex gap-1">
          <Link
            href={`/admin/market/${item.id}`}
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

      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
        {item.title}
      </h3>

      {item.value && (
        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          {item.value}
        </p>
      )}

      {item.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {item.notes}
        </p>
      )}

      {item.source && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Source: {item.source}
        </p>
      )}
    </div>
  );
}

// Icons
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
