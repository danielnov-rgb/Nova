import { DatasetMetric, SearchResult } from "../types";

export const mockSearchIndex: Array<{ keywords: string[]; results: SearchResult[] }> = [
  {
    keywords: ["saas", "benchmark", "arr", "growth"],
    results: [
      {
        title: "SaaS Growth Benchmarks for Early-Stage Companies",
        url: "https://example.com/saas-growth-benchmarks",
        snippet: "Benchmarks for ARR ramp, CAC payback, and net retention across SaaS stages.",
        source: "Benchmark Report",
        publishedAt: "2024-06-15",
      },
      {
        title: "ARR Ramp Time by SaaS Category",
        url: "https://example.com/arr-ramp-time",
        snippet: "Median time to $1M ARR by category, plus growth curve expectations.",
        source: "SaaS Metrics",
        publishedAt: "2024-11-02",
      },
    ],
  },
  {
    keywords: ["pricing", "packaging", "usage", "monetization"],
    results: [
      {
        title: "B2B SaaS Pricing Models in 2025",
        url: "https://example.com/pricing-models",
        snippet: "Usage-based, seat-based, and outcome-based pricing trends.",
        source: "Pricing Index",
        publishedAt: "2025-01-20",
      },
      {
        title: "Enterprise Buyers and Pricing Sensitivity",
        url: "https://example.com/enterprise-pricing",
        snippet: "Enterprise procurement changes and discounting benchmarks.",
        source: "Buyer Survey",
        publishedAt: "2024-10-05",
      },
    ],
  },
  {
    keywords: ["adoption", "retention", "activation", "product-led"],
    results: [
      {
        title: "PLG Activation Benchmarks",
        url: "https://example.com/activation-benchmarks",
        snippet: "Activation rates and time-to-value benchmarks for PLG SaaS.",
        source: "PLG Institute",
        publishedAt: "2024-08-12",
      },
      {
        title: "Retention Curves for B2B SaaS",
        url: "https://example.com/retention-curves",
        snippet: "Retention curve shapes and cohort decay expectations.",
        source: "Retention Lab",
        publishedAt: "2024-12-03",
      },
    ],
  },
  {
    keywords: ["macro", "economy", "enterprise", "tech spend"],
    results: [
      {
        title: "Enterprise Tech Spending Outlook",
        url: "https://example.com/enterprise-spend",
        snippet: "Forecasts for enterprise software budgets and procurement cycles.",
        source: "Industry Outlook",
        publishedAt: "2025-02-01",
      },
      {
        title: "Macro Indicators and Software Demand",
        url: "https://example.com/macro-software",
        snippet: "Macro indicators that correlate with software adoption velocity.",
        source: "Economic Review",
        publishedAt: "2024-09-19",
      },
    ],
  },
  {
    keywords: ["disposable income", "consumer spend", "budget"],
    results: [
      {
        title: "Disposable Income Trends and Subscription Spend",
        url: "https://example.com/disposable-income",
        snippet: "Household budget pressure and subscription churn behavior.",
        source: "Consumer Index",
        publishedAt: "2024-11-28",
      },
      {
        title: "Consumer Spend Allocation by Category",
        url: "https://example.com/spend-allocation",
        snippet: "Shift in discretionary spend categories and implications for SaaS.",
        source: "Spend Tracker",
        publishedAt: "2025-01-08",
      },
    ],
  },
];

export const mockDataset: DatasetMetric[] = [
  {
    key: "arr_time_to_1m_median_months",
    label: "Median time to $1M ARR",
    value: 18,
    unit: "months",
    updatedAt: "2024-12-31",
    source: "Nova Benchmark Vault",
  },
  {
    key: "cac_ltv_ratio_median",
    label: "Median CAC to LTV ratio",
    value: "1:4.8",
    updatedAt: "2024-12-31",
    source: "Nova Benchmark Vault",
  },
  {
    key: "activation_rate_median",
    label: "Median activation rate",
    value: 0.36,
    unit: "ratio",
    updatedAt: "2024-11-15",
    source: "Nova Product Benchmarks",
  },
  {
    key: "enterprise_discount_rate",
    label: "Typical enterprise discount band",
    value: "12-18%",
    updatedAt: "2024-10-10",
    source: "Pricing Signals",
  },
  {
    key: "disposable_income_pressure",
    label: "Consumer budget pressure index",
    value: "moderate",
    updatedAt: "2024-12-20",
    source: "Consumer Spend Signals",
  },
];

export const mockInternalDataset: DatasetMetric[] = [
  {
    key: "internal_activation_rate",
    label: "Internal activation rate",
    value: 0.42,
    unit: "ratio",
    updatedAt: "2024-12-15",
    source: "Nova Internal Benchmarks",
  },
];
