import { randomUUID } from "node:crypto";
import {
  AgentRun,
  Evidence,
  Insight,
  ResearchAgent,
  ResearchContext,
  SearchResult,
} from "../types";
import { scoreConfidence, scoreFreshnessFromEvidence } from "../utils/scoring";
import { toIsoString } from "../utils/time";

export abstract class BaseAgent implements ResearchAgent {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly categories: ResearchAgent["categories"];

  protected constructor(options: {
    id: string;
    name: string;
    description: string;
    categories: ResearchAgent["categories"];
  }) {
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.categories = options.categories;
  }

  async run(context: ResearchContext): Promise<AgentRun> {
    const startedAt = new Date();
    try {
      const insights = await this.buildInsights(context);
      const finishedAt = new Date();
      return {
        agentId: this.id,
        agentName: this.name,
        startedAt: toIsoString(startedAt),
        finishedAt: toIsoString(finishedAt),
        insights,
        errors: [],
      };
    } catch (error) {
      const finishedAt = new Date();
      return {
        agentId: this.id,
        agentName: this.name,
        startedAt: toIsoString(startedAt),
        finishedAt: toIsoString(finishedAt),
        insights: [],
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  protected abstract buildInsights(context: ResearchContext): Promise<Insight[]>;

  protected async search(context: ResearchContext, queries: string[], limit = 4) {
    const results = await Promise.all(
      queries.map((query) => context.clients.search.search(query, { limit }))
    );
    return results.flat();
  }

  protected createEvidence(results: SearchResult[]): Evidence[] {
    return results.map((result) => ({
      source: {
        name: result.source,
        url: result.url,
        access: "public",
        collectedAt: result.publishedAt ?? new Date().toISOString(),
      },
      excerpt: result.snippet,
      relevanceScore: 0.6,
    }));
  }

  protected buildInsight(params: {
    category: Insight["category"];
    title: string;
    summary: string;
    signals: Insight["signals"];
    evidence: Evidence[];
    tags: string[];
  }): Insight {
    const confidence = scoreConfidence(params.evidence);
    const freshnessDays = scoreFreshnessFromEvidence(params.evidence);

    return {
      id: randomUUID(),
      category: params.category,
      title: params.title,
      summary: params.summary,
      signals: params.signals,
      evidence: params.evidence,
      confidence,
      freshnessDays,
      tags: params.tags,
    };
  }
}
