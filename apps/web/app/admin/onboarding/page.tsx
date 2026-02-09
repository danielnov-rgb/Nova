"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onboardingApi } from "../_lib/api";

interface ClientContext {
  id: string;
  tenantId: string;
  objectives: string | null;
  businessModel: string | null;
  competitiveAdvantages: string | null;
  existingProblems: string | null;
  designSystemUrl: string | null;
  gitRepoUrl: string | null;
  terminologyGlossary: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export default function OnboardingPage() {
  const [context, setContext] = useState<ClientContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editable fields
  const [objectives, setObjectives] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [competitiveAdvantages, setCompetitiveAdvantages] = useState("");
  const [existingProblems, setExistingProblems] = useState("");
  const [designSystemUrl, setDesignSystemUrl] = useState("");
  const [gitRepoUrl, setGitRepoUrl] = useState("");

  // Terminology
  const [terminology, setTerminology] = useState<Record<string, string>>({});
  const [newTerm, setNewTerm] = useState("");
  const [newDefinition, setNewDefinition] = useState("");

  useEffect(() => {
    fetchContext();
  }, []);

  async function fetchContext() {
    try {
      const data = await onboardingApi.get();
      setContext(data);
      setObjectives(data.objectives || "");
      setBusinessModel(data.businessModel || "");
      setCompetitiveAdvantages(data.competitiveAdvantages || "");
      setExistingProblems(data.existingProblems || "");
      setDesignSystemUrl(data.designSystemUrl || "");
      setGitRepoUrl(data.gitRepoUrl || "");
      setTerminology(data.terminologyGlossary || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load context");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await onboardingApi.update({
        objectives: objectives || undefined,
        businessModel: businessModel || undefined,
        competitiveAdvantages: competitiveAdvantages || undefined,
        existingProblems: existingProblems || undefined,
        designSystemUrl: designSystemUrl || undefined,
        gitRepoUrl: gitRepoUrl || undefined,
        terminologyGlossary: terminology,
      });
      setSuccessMessage("Changes saved successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  function handleAddTerm() {
    if (!newTerm.trim() || !newDefinition.trim()) return;
    setTerminology((prev) => ({
      ...prev,
      [newTerm.trim()]: newDefinition.trim(),
    }));
    setNewTerm("");
    setNewDefinition("");
  }

  function handleRemoveTerm(term: string) {
    setTerminology((prev) => {
      const next = { ...prev };
      delete next[term];
      return next;
    });
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Client Onboarding
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure your company context so Nova understands your objectives and speaks your language
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Objectives */}
          <Section
            title="Business Objectives"
            description="What are you trying to achieve? What does success look like?"
            icon={<TargetIcon />}
          >
            <textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              rows={4}
              placeholder="e.g., Increase user activation by 30% in Q2, Reduce churn for enterprise customers, Launch mobile app by end of year..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </Section>

          {/* Business Model */}
          <Section
            title="Business Model"
            description="How does your business work? Who are your customers?"
            icon={<ChartIcon />}
          >
            <textarea
              value={businessModel}
              onChange={(e) => setBusinessModel(e.target.value)}
              rows={4}
              placeholder="e.g., B2B SaaS selling to mid-market companies. Freemium model with team-based pricing. Average deal size $50K ARR..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </Section>

          {/* Competitive Advantages */}
          <Section
            title="Competitive Advantages"
            description="What makes you different from competitors?"
            icon={<TrophyIcon />}
          >
            <textarea
              value={competitiveAdvantages}
              onChange={(e) => setCompetitiveAdvantages(e.target.value)}
              rows={3}
              placeholder="e.g., Best-in-class integration capabilities, 10x faster than legacy solutions, Founded by industry veterans..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </Section>

          {/* Existing Problems */}
          <Section
            title="Known Challenges"
            description="What problems are you already aware of?"
            icon={<AlertIcon />}
          >
            <textarea
              value={existingProblems}
              onChange={(e) => setExistingProblems(e.target.value)}
              rows={3}
              placeholder="e.g., Onboarding is too long, Mobile experience is lacking, Enterprise features needed for larger deals..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </Section>

          {/* System URLs */}
          <Section
            title="Connected Systems"
            description="Link your design system and code repository"
            icon={<LinkIcon />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Design System URL
                </label>
                <input
                  type="url"
                  value={designSystemUrl}
                  onChange={(e) => setDesignSystemUrl(e.target.value)}
                  placeholder="https://figma.com/..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Git Repository URL
                </label>
                <input
                  type="url"
                  value={gitRepoUrl}
                  onChange={(e) => setGitRepoUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </Section>

          {/* Terminology Glossary */}
          <Section
            title="Terminology Glossary"
            description="Define terms specific to your business so Nova speaks your language"
            icon={<BookIcon />}
          >
            {/* Existing terms */}
            <div className="space-y-2 mb-4">
              {Object.entries(terminology).map(([term, definition]) => (
                <div
                  key={term}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{term}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{definition}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveTerm(term)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {Object.keys(terminology).length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No terms defined yet. Add your first term below.
                </p>
              )}
            </div>

            {/* Add new term */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                placeholder="Term"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={newDefinition}
                onChange={(e) => setNewDefinition(e.target.value)}
                placeholder="Definition"
                className="flex-[2] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAddTerm}
                disabled={!newTerm.trim() || !newDefinition.trim()}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </Section>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// Icons
function TargetIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
