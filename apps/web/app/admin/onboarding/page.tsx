"use client";

import { useEffect, useState, useCallback } from "react";
import { onboardingApi, type ClientContext } from "../_lib/api";
import { getAgent, agentColors } from "../_data/nova-agents";
import { useAstraActions } from "../_components/astra";

type Tab = "overview" | "edit" | "capabilities";

const agent = getAgent("strategy")!;
const colors = agentColors[agent.color]!;

const contextFields = [
  { key: "objectives" as const, label: "Business Objectives", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", placeholder: "e.g., Increase user activation by 30% in Q2, Launch mobile app..." },
  { key: "businessModel" as const, label: "Business Model", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", placeholder: "e.g., B2B SaaS platform for professional services..." },
  { key: "competitiveAdvantages" as const, label: "Competitive Advantages", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z", placeholder: "e.g., AI-orchestrated agent pipeline, 6-8x acceleration..." },
  { key: "existingProblems" as const, label: "Known Challenges", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", placeholder: "e.g., Discovery process takes 17-24 weeks..." },
];

export default function StrategyAgentPage() {
  const [context, setContext] = useState<ClientContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Editable fields
  const [form, setForm] = useState({
    objectives: "",
    businessModel: "",
    competitiveAdvantages: "",
    existingProblems: "",
    designSystemUrl: "",
    gitRepoUrl: "",
  });
  const [terminology, setTerminology] = useState<Record<string, string>>({});
  const [newTerm, setNewTerm] = useState("");
  const [newDefinition, setNewDefinition] = useState("");

  // Astra chat actions — fill form fields from AI conversation
  const handleAstraAction = useCallback((action: { type: string; payload: Record<string, unknown> }) => {
    const text = action.payload.text as string;
    switch (action.type) {
      case "update_objectives":
        setForm(prev => ({ ...prev, objectives: text }));
        setActiveTab("edit");
        break;
      case "update_business_model":
        setForm(prev => ({ ...prev, businessModel: text }));
        setActiveTab("edit");
        break;
      case "update_competitive_advantages":
        setForm(prev => ({ ...prev, competitiveAdvantages: text }));
        setActiveTab("edit");
        break;
      case "update_existing_problems":
        setForm(prev => ({ ...prev, existingProblems: text }));
        setActiveTab("edit");
        break;
      case "add_terminology":
        setTerminology(prev => ({
          ...prev,
          [action.payload.term as string]: action.payload.definition as string,
        }));
        setActiveTab("edit");
        break;
    }
  }, []);
  useAstraActions(handleAstraAction);

  useEffect(() => {
    async function fetchContext() {
      try {
        const data = await onboardingApi.get();
        setContext(data);
        setForm({
          objectives: data.objectives || "",
          businessModel: data.businessModel || "",
          competitiveAdvantages: data.competitiveAdvantages || "",
          existingProblems: data.existingProblems || "",
          designSystemUrl: data.designSystemUrl || "",
          gitRepoUrl: data.gitRepoUrl || "",
        });
        setTerminology(data.terminologyGlossary || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load context");
      } finally {
        setLoading(false);
      }
    }
    fetchContext();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await onboardingApi.update({
        objectives: form.objectives || undefined,
        businessModel: form.businessModel || undefined,
        competitiveAdvantages: form.competitiveAdvantages || undefined,
        existingProblems: form.existingProblems || undefined,
        designSystemUrl: form.designSystemUrl || undefined,
        gitRepoUrl: form.gitRepoUrl || undefined,
        terminologyGlossary: terminology,
      });
      setContext(data);
      setSuccessMessage("Context saved. All downstream agents updated.");
      setActiveTab("overview");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  // Calculate ingestion completeness
  const totalFields = contextFields.length + 2; // +2 for URLs
  const filledFields = contextFields.filter((f) => form[f.key]?.trim()).length
    + (form.designSystemUrl ? 1 : 0)
    + (form.gitRepoUrl ? 1 : 0);
  const completeness = Math.round((filledFields / totalFields) * 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Agent Header */}
        <div className={`rounded-xl border ${colors.border} ${colors.bg} p-6 mb-8`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <span className={`text-sm font-bold px-3 py-1 rounded-lg ${colors.badge} text-white`}>
                {agent.phase}
              </span>
              <div>
                <h1 className="text-2xl font-bold text-white">{agent.title}</h1>
                <p className={`text-sm ${colors.text} mt-0.5`}>{agent.role}</p>
                <p className="text-gray-400 text-sm mt-2 max-w-2xl">{agent.summary}</p>
              </div>
            </div>
            {/* Completeness indicator */}
            <div className="text-right hidden sm:block">
              <div className="text-2xl font-bold text-white">{completeness}%</div>
              <div className="text-xs text-gray-400">Context Ingested</div>
              <div className="w-24 h-1.5 bg-gray-800 rounded-full mt-2">
                <div
                  className={`h-full rounded-full ${colors.badge} transition-all`}
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
            <p className="text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-800 pb-px">
          {(["overview", "edit", "capabilities"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab
                  ? "bg-gray-900 text-white border-b-2 border-primary-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-900/50"
              }`}
            >
              {tab === "overview" ? "Ingested Context" : tab === "edit" ? "Edit Context" : "Capabilities"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewTab form={form} terminology={terminology} designSystemUrl={form.designSystemUrl} gitRepoUrl={form.gitRepoUrl} onEdit={() => setActiveTab("edit")} />
        )}
        {activeTab === "edit" && (
          <EditTab
            form={form}
            setForm={setForm}
            terminology={terminology}
            setTerminology={setTerminology}
            newTerm={newTerm}
            setNewTerm={setNewTerm}
            newDefinition={newDefinition}
            setNewDefinition={setNewDefinition}
            saving={saving}
            onSave={handleSave}
          />
        )}
        {activeTab === "capabilities" && <CapabilitiesTab />}
      </div>
    </div>
  );
}

// === Overview Tab ===
function OverviewTab({
  form,
  terminology,
  designSystemUrl,
  gitRepoUrl,
  onEdit,
}: {
  form: { objectives: string; businessModel: string; competitiveAdvantages: string; existingProblems: string };
  terminology: Record<string, string>;
  designSystemUrl: string;
  gitRepoUrl: string;
  onEdit: () => void;
}) {
  const hasAnyContent = contextFields.some((f) => form[f.key]?.trim());

  if (!hasAnyContent) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No context ingested yet</h3>
        <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
          The Strategy Agent needs your business context to align all downstream agents. Start by adding your objectives and business model.
        </p>
        <button onClick={onEdit} className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
          Add Business Context
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contextFields.map((field) => {
        const value = form[field.key];
        if (!value?.trim()) return null;
        return (
          <div key={field.key} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                <svg className={`w-4 h-4 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                </svg>
              </div>
              <h3 className="font-medium text-white">{field.label}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 ml-auto">
                Ingested
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{value}</p>
          </div>
        );
      })}

      {/* Connected Systems */}
      {(designSystemUrl || gitRepoUrl) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
              <svg className={`w-4 h-4 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="font-medium text-white">Connected Systems</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {designSystemUrl && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Design System:</span>
                <a href={designSystemUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline truncate">{designSystemUrl}</a>
              </div>
            )}
            {gitRepoUrl && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Git Repository:</span>
                <a href={gitRepoUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline truncate">{gitRepoUrl}</a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Terminology */}
      {Object.keys(terminology).length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
              <svg className={`w-4 h-4 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-medium text-white">Terminology Glossary</h3>
            <span className="text-xs text-gray-500 ml-auto">{Object.keys(terminology).length} terms</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(terminology).map(([term, def]) => (
              <div key={term} className="flex gap-2 text-sm">
                <span className="font-medium text-white whitespace-nowrap">{term}:</span>
                <span className="text-gray-400">{def}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onEdit} className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors">
        Edit Context
      </button>
    </div>
  );
}

// === Edit Tab ===
function EditTab({
  form,
  setForm,
  terminology,
  setTerminology,
  newTerm,
  setNewTerm,
  newDefinition,
  setNewDefinition,
  saving,
  onSave,
}: {
  form: { objectives: string; businessModel: string; competitiveAdvantages: string; existingProblems: string; designSystemUrl: string; gitRepoUrl: string };
  setForm: (fn: (prev: typeof form) => typeof form) => void;
  terminology: Record<string, string>;
  setTerminology: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  newTerm: string;
  setNewTerm: (v: string) => void;
  newDefinition: string;
  setNewDefinition: (v: string) => void;
  saving: boolean;
  onSave: () => void;
}) {
  function handleAddTerm() {
    if (!newTerm.trim() || !newDefinition.trim()) return;
    setTerminology((prev) => ({ ...prev, [newTerm.trim()]: newDefinition.trim() }));
    setNewTerm("");
    setNewDefinition("");
  }

  return (
    <div className="space-y-6">
      {contextFields.map((field) => (
        <div key={field.key} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
              <svg className={`w-4 h-4 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
              </svg>
            </div>
            <h3 className="font-medium text-white">{field.label}</h3>
          </div>
          <textarea
            value={form[field.key]}
            onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
            rows={4}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      ))}

      {/* Connected Systems */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-medium text-white mb-3">Connected Systems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Design System URL</label>
            <input
              type="url"
              value={form.designSystemUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, designSystemUrl: e.target.value }))}
              placeholder="https://figma.com/..."
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Git Repository URL</label>
            <input
              type="url"
              value={form.gitRepoUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, gitRepoUrl: e.target.value }))}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>
        </div>
      </div>

      {/* Terminology */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-medium text-white mb-3">Terminology Glossary</h3>
        <div className="space-y-2 mb-4">
          {Object.entries(terminology).map(([term, definition]) => (
            <div key={term} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-white">{term}</div>
                <div className="text-sm text-gray-400">{definition}</div>
              </div>
              <button
                onClick={() => setTerminology((prev) => { const next = { ...prev }; delete next[term]; return next; })}
                className="text-gray-500 hover:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            placeholder="Term"
            className="flex-1 px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
          />
          <input
            type="text"
            value={newDefinition}
            onChange={(e) => setNewDefinition(e.target.value)}
            placeholder="Definition"
            className="flex-[2] px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
          />
          <button
            onClick={handleAddTerm}
            disabled={!newTerm.trim() || !newDefinition.trim()}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="pt-4 border-t border-gray-800">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors"
        >
          {saving ? "Saving..." : "Save & Update All Agents"}
        </button>
      </div>
    </div>
  );
}

// === Capabilities Tab ===
function CapabilitiesTab() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400 mb-4">
        The Strategy Agent provides these capabilities. Context you provide here flows to every downstream agent.
      </p>
      {agent.capabilities.map((cap, i) => (
        <div key={i} className="flex items-start gap-3 p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
            <svg className={`w-3.5 h-3.5 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm text-gray-300">{cap}</span>
        </div>
      ))}
    </div>
  );
}
