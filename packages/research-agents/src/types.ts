export type InsightCategory =
  | "saas-benchmarks"
  | "pricing-intel"
  | "adoption"
  | "macro-economy"
  | "consumer-spend"
  | "innovation-trends"
  | "internal-performance"
  | "source-scout";

export type DataAccess = "public" | "paid" | "internal";

export interface SourceRef {
  name: string;
  url?: string;
  access: DataAccess;
  collectedAt: string;
}

export interface Evidence {
  source: SourceRef;
  excerpt: string;
  relevanceScore: number;
}

export interface Signal {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  direction?: "up" | "down" | "flat" | "unknown";
  timeframe?: string;
  source?: string;
}

export interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  summary: string;
  signals: Signal[];
  evidence: Evidence[];
  confidence: number;
  freshnessDays: number;
  tags: string[];
}

export interface AgentRun {
  agentId: string;
  agentName: string;
  startedAt: string;
  finishedAt: string;
  insights: Insight[];
  errors: string[];
}

export interface ResearchReport {
  id: string;
  generatedAt: string;
  context: ReportContext;
  agentRuns: AgentRun[];
  insights: Insight[];
  summary: {
    totalInsights: number;
    byCategory: Record<InsightCategory, number>;
    errors: number;
  };
}

export interface ReportContext {
  markets: string[];
  industries: string[];
  horizon: string;
  focusAreas: string[];
}

export interface ResearchContext {
  now: Date;
  markets: string[];
  industries: string[];
  horizon: string;
  focusAreas: string[];
  clients: {
    search: SearchClient;
    datasets: DatasetClient;
    internal: DatasetClient;
  };
}

export interface SearchOptions {
  limit?: number;
  recencyDays?: number;
  market?: string;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  publishedAt?: string;
}

export interface SearchClient {
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}

export interface DatasetMetric {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  updatedAt: string;
  source: string;
}

export interface DatasetClient {
  getMetric(key: string): Promise<DatasetMetric | null>;
}

export interface ResearchAgent {
  id: string;
  name: string;
  description: string;
  categories: InsightCategory[];
  run(context: ResearchContext): Promise<AgentRun>;
}

export interface OrchestratorOptions {
  maxConcurrency?: number;
}
