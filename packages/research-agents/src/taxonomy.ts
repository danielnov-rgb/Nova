import { InsightCategory } from "./types";

export const INSIGHT_CATEGORIES: Record<InsightCategory, { label: string; description: string }> = {
  "saas-benchmarks": {
    label: "SaaS Benchmarks",
    description: "Growth, ARR ramp, CAC/LTV, and performance baselines for SaaS",
  },
  "pricing-intel": {
    label: "Pricing Intelligence",
    description: "Packaging, monetization models, and price sensitivity trends",
  },
  adoption: {
    label: "Adoption Signals",
    description: "Activation, retention, and product adoption patterns",
  },
  "macro-economy": {
    label: "Macro Economy",
    description: "Macro and sector-level drivers that influence enterprise spend",
  },
  "consumer-spend": {
    label: "Consumer Spend",
    description: "Disposable income, spend allocation, and budget pressure indicators",
  },
  "innovation-trends": {
    label: "Innovation Trends",
    description: "Emerging tech themes and competitive shifts",
  },
  "internal-performance": {
    label: "Internal Performance",
    description: "Nova-owned or client-proprietary data for benchmarking",
  },
  "source-scout": {
    label: "Source Intelligence",
    description: "Recommended data sources and datasets for research coverage",
  },
};
