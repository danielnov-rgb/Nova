import { Insight } from "@nova/research-agents";

export type DisplayVisual =
  | "benchmark-cards"
  | "pricing-matrix"
  | "funnel-cohort"
  | "trendline"
  | "index-gauge"
  | "signal-list"
  | "source-list";

export interface DisplayHint {
  headline: string;
  primaryMetricKeys: string[];
  recommendedVisual: DisplayVisual;
  supportingNotes: string[];
}

const displayNotesByCategory: Record<Insight["category"], DisplayHint> = {
  "saas-benchmarks": {
    headline: "Benchmark baselines",
    primaryMetricKeys: ["arr_time_to_1m_median_months", "cac_ltv_ratio_median"],
    recommendedVisual: "benchmark-cards",
    supportingNotes: [
      "Show median benchmark values as tiles.",
      "Add peer group comparison when available.",
    ],
  },
  "pricing-intel": {
    headline: "Pricing posture",
    primaryMetricKeys: ["enterprise_discount_rate"],
    recommendedVisual: "pricing-matrix",
    supportingNotes: [
      "Highlight pricing model mix and discount bands.",
      "Pair with win-loss or package performance.",
    ],
  },
  adoption: {
    headline: "Adoption health",
    primaryMetricKeys: ["activation_rate_median"],
    recommendedVisual: "funnel-cohort",
    supportingNotes: [
      "Use activation rate as KPI.",
      "Overlay retention curves when available.",
    ],
  },
  "macro-economy": {
    headline: "Macro drivers",
    primaryMetricKeys: [],
    recommendedVisual: "trendline",
    supportingNotes: [
      "Plot macro signals against pipeline velocity.",
      "Add event markers for market shocks.",
    ],
  },
  "consumer-spend": {
    headline: "Consumer budget pressure",
    primaryMetricKeys: ["disposable_income_pressure"],
    recommendedVisual: "index-gauge",
    supportingNotes: [
      "Use an index or gauge to show pressure level.",
      "Tie to churn and downgrade risk.",
    ],
  },
  "innovation-trends": {
    headline: "Innovation themes",
    primaryMetricKeys: [],
    recommendedVisual: "signal-list",
    supportingNotes: [
      "List emerging themes with evidence links.",
      "Add momentum indicator based on source recency.",
    ],
  },
  "internal-performance": {
    headline: "Internal benchmarks",
    primaryMetricKeys: ["internal_activation_rate"],
    recommendedVisual: "benchmark-cards",
    supportingNotes: [
      "Surface proprietary KPIs in a private section.",
      "Keep client data partitioned by tenant.",
    ],
  },
  "source-scout": {
    headline: "Recommended data sources",
    primaryMetricKeys: [],
    recommendedVisual: "source-list",
    supportingNotes: [
      "List sources with access level and cadence.",
      "Mark paid sources for procurement review.",
    ],
  },
};

export function buildDisplayHint(insight: Insight): DisplayHint {
  return displayNotesByCategory[insight.category];
}

export function buildDisplayHints(insights: Insight[]) {
  return insights.map((insight) => ({
    insightId: insight.id,
    category: insight.category,
    ...buildDisplayHint(insight),
  }));
}
