import { InsightCategory } from "../types";

export type SourceAccess = "public" | "paid" | "internal";

export interface SourceCatalogEntry {
  id: string;
  name: string;
  category: InsightCategory;
  access: SourceAccess;
  url: string;
  coverage: string;
  updateCadence: string;
  notes: string[];
}

export const sourceCatalog: SourceCatalogEntry[] = [
  {
    id: "bea-personal-income",
    name: "U.S. BEA - Personal Income and Outlays",
    category: "consumer-spend",
    access: "public",
    url: "https://www.bea.gov/data/income-saving/personal-income",
    coverage: "Disposable personal income, saving rates, PCE",
    updateCadence: "monthly",
    notes: [
      "Use for disposable income and spending trends.",
      "Useful for pricing sensitivity context.",
    ],
  },
  {
    id: "bls-consumer-expenditure",
    name: "BLS Consumer Expenditure Survey",
    category: "consumer-spend",
    access: "public",
    url: "https://www.bls.gov/cex/",
    coverage: "Household expenditure patterns and allocation",
    updateCadence: "annual",
    notes: [
      "Good for spend allocation by category.",
      "Helps model discretionary budget pressure.",
    ],
  },
  {
    id: "fred-macro",
    name: "FRED Economic Data",
    category: "macro-economy",
    access: "public",
    url: "https://fred.stlouisfed.org/",
    coverage: "Macro indicators: rates, GDP, unemployment, inflation",
    updateCadence: "varies (daily/monthly/quarterly)",
    notes: [
      "Useful macro context for enterprise spend and adoption.",
      "Wide coverage with API support.",
    ],
  },
  {
    id: "bls-cpi",
    name: "BLS Consumer Price Index",
    category: "macro-economy",
    access: "public",
    url: "https://www.bls.gov/cpi/",
    coverage: "Inflation and price pressure",
    updateCadence: "monthly",
    notes: [
      "Use to normalize pricing changes and cost pressure.",
      "Useful for budgeting scenarios.",
    ],
  },
  {
    id: "saas-capital-benchmarks",
    name: "SaaS Capital - SaaS Benchmarks",
    category: "saas-benchmarks",
    access: "paid",
    url: "https://www.saas-capital.com/benchmarking/",
    coverage: "ARR growth, CAC payback, revenue retention",
    updateCadence: "annual",
    notes: [
      "Benchmarks for private SaaS companies.",
      "Often gated by report download.",
    ],
  },
  {
    id: "openview-saas-benchmarks",
    name: "OpenView - SaaS Benchmarks Report",
    category: "saas-benchmarks",
    access: "public",
    url: "https://openviewpartners.com/blog/2023-saas-benchmarks-report/",
    coverage: "SaaS metrics by stage, growth, NRR, retention",
    updateCadence: "annual",
    notes: [
      "Publicly available benchmark reports.",
      "Good early-stage comparison set.",
    ],
  },
  {
    id: "openview-pricing-insights",
    name: "OpenView - Pricing Insights from 2,200 SaaS Companies",
    category: "pricing-intel",
    access: "public",
    url: "https://openviewpartners.com/blog/saas-pricing-insights/",
    coverage: "Pricing maturity, packaging, price review frequency",
    updateCadence: "periodic",
    notes: [
      "Survey-based dataset across thousands of SaaS companies.",
      "Useful for pricing process maturity benchmarks.",
    ],
  },
  {
    id: "gartner-it-spend",
    name: "Gartner - Worldwide IT Spending Forecasts",
    category: "macro-economy",
    access: "paid",
    url: "https://www.gartner.com/en/newsroom/press-releases/2026-02-03-gartner-forecasts-worldwide-it-spending-to-grow-10-point-8-percent-in-2026-totaling-6-point-15-trillion-dollars",
    coverage: "IT spend forecasts and enterprise software markets",
    updateCadence: "quarterly",
    notes: [
      "Paid subscription required.",
      "Useful for enterprise budget forecasting.",
    ],
  },
  {
    id: "forrester-tech-spend",
    name: "Forrester - Global Tech Market Forecast",
    category: "macro-economy",
    access: "paid",
    url: "https://www.forrester.com/press-newsroom/forrester-global-tech-spend-to-surpass-4-9-trillion-in-2025/",
    coverage: "Technology spend outlook, buyer behavior",
    updateCadence: "quarterly",
    notes: [
      "Paid research access.",
      "Complementary to Gartner for procurement insights.",
    ],
  },
  {
    id: "g2-grids",
    name: "G2 Market Reports",
    category: "innovation-trends",
    access: "public",
    url: "https://www.g2.com/reports",
    coverage: "Category trends, competitive movement, buyer reviews",
    updateCadence: "quarterly",
    notes: [
      "Useful for competitive trend signals.",
      "Can be enriched with review sentiment.",
    ],
  },
];
