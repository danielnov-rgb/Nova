import { BaseAgent } from "./base";
import { Insight, ResearchContext, Signal } from "../types";
import { sourceCatalog } from "../sources/catalog";

export class SourceScoutAgent extends BaseAgent {
  constructor() {
    super({
      id: "source-scout",
      name: "Source Scout",
      description: "Identifies high-value public and paid data sources",
      categories: ["source-scout"],
    });
  }

  protected async buildInsights(context: ResearchContext): Promise<Insight[]> {
    const focus = context.focusAreas.map((item) => item.toLowerCase());

    const candidates = sourceCatalog.filter((entry) => {
      if (focus.length === 0) return true;
      return focus.some((term) => entry.coverage.toLowerCase().includes(term));
    });

    const nowIso = context.now.toISOString();

    return candidates.map((entry) => {
      const signals: Signal[] = [
        {
          key: "source_access",
          label: "Access type",
          value: entry.access,
        },
        {
          key: "update_cadence",
          label: "Update cadence",
          value: entry.updateCadence,
        },
      ];

      return this.buildInsight({
        category: "source-scout",
        title: entry.name,
        summary: entry.coverage,
        signals,
        evidence: [
          {
            source: {
              name: entry.name,
              url: entry.url,
              access: entry.access,
              collectedAt: nowIso,
            },
            excerpt: entry.coverage,
            relevanceScore: entry.access === "paid" ? 0.7 : 0.6,
          },
        ],
        tags: [entry.category, entry.access, "source"],
      });
    });
  }
}
