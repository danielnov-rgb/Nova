import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const dataPath = join(
  process.cwd(),
  "..",
  "..",
  "services",
  "research-intel",
  "data",
  "latest.json"
);

type DisplayHint = {
  insightId: string;
  category: string;
  headline: string;
  primaryMetricKeys: string[];
  recommendedVisual: string;
  supportingNotes: string[];
};

type Insight = {
  id: string;
  category: string;
  title: string;
  summary: string;
  signals: Array<{
    key: string;
    label: string;
    value: string | number;
    unit?: string;
    timeframe?: string;
    source?: string;
  }>;
  evidence: Array<{
    source: {
      name: string;
      url?: string;
      access: "public" | "paid" | "internal";
      collectedAt: string;
    };
    excerpt: string;
    relevanceScore: number;
  }>;
  confidence: number;
  freshnessDays: number;
  tags: string[];
};

type ReportEnvelope = {
  schemaVersion: string;
  report: {
    id: string;
    generatedAt: string;
    summary: {
      totalInsights: number;
      byCategory: Record<string, number>;
      errors: number;
    };
    insights: Insight[];
  };
  displayHints: DisplayHint[];
};

async function loadReport(): Promise<ReportEnvelope | null> {
  if (!existsSync(dataPath)) return null;
  const raw = await readFile(dataPath, "utf-8");
  return JSON.parse(raw) as ReportEnvelope;
}

function formatValue(value: string | number, unit?: string) {
  if (typeof value === "number") {
    const rounded = Number.isInteger(value) ? value.toString() : value.toFixed(2);
    return unit ? `${rounded} ${unit}` : rounded;
  }
  return unit ? `${value} ${unit}` : value;
}

function Badge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "amber" | "emerald" }) {
  const styles = {
    blue: "bg-blue-500/15 text-blue-200 border-blue-500/30",
    amber: "bg-amber-500/15 text-amber-200 border-amber-500/30",
    emerald: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${styles[tone]}`}>
      {children}
    </span>
  );
}

export default async function ResearchIntelPage() {
  const data = await loadReport();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-gray-950">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300">Nova Research Intel</p>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">Source Management & Trend Intelligence</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            A live view of Nova's research agents, curated sources, and insight outputs for enterprise product strategy.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Badge tone="blue">Schema {data?.schemaVersion ?? "1.0"}</Badge>
            <Badge tone="emerald">Insights {data?.report.summary.totalInsights ?? 0}</Badge>
            <Badge tone="amber">Errors {data?.report.summary.errors ?? 0}</Badge>
            <Badge tone="blue">Generated {data?.report.generatedAt ?? "No report yet"}</Badge>
          </div>
        </div>
      </section>

      {!data ? (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">No report found</h2>
            <p className="mt-3 text-sm text-slate-300">
              Run the research intel service to generate `latest.json`. The UI will automatically pick it up.
            </p>
            <div className="mt-6 rounded-xl bg-black/40 p-4 text-sm text-slate-200">
              <code>pnpm --filter @nova/research-intel start -- --output ../services/research-intel/data</code>
            </div>
          </div>
        </section>
      ) : (
        <div className="mx-auto max-w-7xl px-6 py-16 space-y-16">
          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold">Source Management</h2>
              <p className="mt-2 text-sm text-slate-300">
                Recommended datasets (public + paid) tagged by access and update cadence.
              </p>
              <div className="mt-6 space-y-4">
                {data.report.insights
                  .filter((insight) => insight.category === "source-scout")
                  .map((insight) => {
                    const access = insight.signals.find((signal) => signal.key === "source_access")?.value ?? "public";
                    const cadence = insight.signals.find((signal) => signal.key === "update_cadence")?.value ?? "";
                    return (
                      <div key={insight.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                            <p className="mt-1 text-sm text-slate-300">{insight.summary}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge tone={access === "paid" ? "amber" : access === "internal" ? "emerald" : "blue"}>
                              {String(access)}
                            </Badge>
                            {cadence ? <Badge tone="blue">{String(cadence)}</Badge> : null}
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-slate-400">
                          Evidence: {insight.evidence[0]?.source.url ?? "No URL"}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-xl font-semibold">Category Mix</h2>
              <p className="mt-2 text-sm text-slate-300">Insights by category.</p>
              <div className="mt-6 space-y-3">
                {Object.entries(data.report.summary.byCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between rounded-lg bg-black/30 px-4 py-3">
                    <span className="text-sm text-slate-200">{category}</span>
                    <span className="text-sm font-semibold text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">Insight Library</h2>
            <p className="mt-2 text-sm text-slate-300">
              Each insight includes signals, evidence, confidence, and recommended visualization hints.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {data.report.insights
                .filter((insight) => insight.category !== "source-scout")
                .map((insight) => {
                  const hint = data.displayHints.find((item) => item.insightId === insight.id);
                  return (
                    <div key={insight.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">{insight.category}</p>
                          <h3 className="mt-2 text-lg font-semibold text-white">{insight.title}</h3>
                        </div>
                        <div className="text-xs text-slate-300">Confidence {Math.round(insight.confidence * 100)}%</div>
                      </div>
                      <p className="mt-3 text-sm text-slate-300">{insight.summary}</p>

                      {insight.signals.length > 0 ? (
                        <div className="mt-4 space-y-2">
                          {insight.signals.map((signal) => (
                            <div key={signal.key} className="flex items-center justify-between rounded-lg bg-black/40 px-3 py-2">
                              <div className="text-xs text-slate-300">{signal.label}</div>
                              <div className="text-sm font-semibold text-white">
                                {formatValue(signal.value, signal.unit)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 text-xs text-slate-400">No structured signals yet.</p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {hint ? <Badge tone="blue">{hint.recommendedVisual}</Badge> : null}
                        <Badge tone="emerald">Freshness {insight.freshnessDays}d</Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
