"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { audienceApi, TargetAudienceType, SegmentDefinition } from "../../_lib/api";

const TYPE_OPTIONS: { value: TargetAudienceType; label: string; description: string }[] = [
  {
    value: "EXISTING",
    label: "Current Customers",
    description: "Your existing user base and customer segments",
  },
  {
    value: "TARGET",
    label: "Target Acquisition",
    description: "The customers you want to acquire",
  },
  {
    value: "MARKET",
    label: "Market Demographics",
    description: "Overall market size and demographics",
  },
];

export default function NewAudiencePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<TargetAudienceType>("EXISTING");
  const [segments, setSegments] = useState<SegmentDefinition[]>([]);

  // New segment form
  const [newSegmentName, setNewSegmentName] = useState("");
  const [newSegmentDescription, setNewSegmentDescription] = useState("");
  const [newSegmentSize, setNewSegmentSize] = useState<number | "">("");

  function handleAddSegment() {
    if (!newSegmentName.trim()) return;

    setSegments((prev) => [
      ...prev,
      {
        name: newSegmentName.trim(),
        description: newSegmentDescription.trim() || undefined,
        size: newSegmentSize ? Number(newSegmentSize) : undefined,
      },
    ]);

    setNewSegmentName("");
    setNewSegmentDescription("");
    setNewSegmentSize("");
  }

  function handleRemoveSegment(index: number) {
    setSegments((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await audienceApi.create({
        name: name.trim(),
        type,
        segments,
      });
      router.push("/admin/audience");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create audience");
      setSaving(false);
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/audience"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Audience
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            New Audience Segment
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Define a new audience segment for your product
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Audience Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Enterprise Product Managers"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Type */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Audience Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    type === option.value
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Segments */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Segments
            </label>

            {/* Existing segments */}
            {segments.length > 0 && (
              <div className="space-y-2 mb-4">
                {segments.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {segment.name}
                        {segment.size && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({segment.size.toLocaleString()} people)
                          </span>
                        )}
                      </div>
                      {segment.description && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {segment.description}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSegment(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new segment */}
            <div className="space-y-3 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newSegmentName}
                  onChange={(e) => setNewSegmentName(e.target.value)}
                  placeholder="Segment name"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  value={newSegmentDescription}
                  onChange={(e) => setNewSegmentDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  value={newSegmentSize}
                  onChange={(e) => setNewSegmentSize(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Size (optional)"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSegment}
                disabled={!newSegmentName.trim()}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Segment
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link
              href="/admin/audience"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors"
            >
              {saving ? "Creating..." : "Create Audience"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
