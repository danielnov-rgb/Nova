import { BaseAgent } from "./base";
import { Insight, ResearchContext, Signal } from "../types";

export class PricingIntelAgent extends BaseAgent {
  constructor() {
    super({
      id: "pricing-intel",
      name: "Pricing Intelligence",
      description: "Tracks SaaS pricing models, packaging, and buyer sensitivity",
      categories: ["pricing-intel"],
    });
  }

  protected async buildInsights(context: ResearchContext): Promise<Insight[]> {
    const results = await this.search(context, [
      "b2b saas pricing models usage based",
      "enterprise pricing discount benchmarks",
    ]);

    const evidence = this.createEvidence(results);
    const signals: Signal[] = [];

    const discountBand = await context.clients.datasets.getMetric(
      "enterprise_discount_rate"
    );

    if (discountBand) {
      signals.push({
        key: discountBand.key,
        label: discountBand.label,
        value: discountBand.value,
        source: discountBand.source,
        timeframe: "last 12 months",
      });
    }

    return [
      this.buildInsight({
        category: "pricing-intel",
        title: "Pricing model and discount posture shifts",
        summary:
          "Pricing signals highlight a mix of usage-based and outcome-based packaging, with increased scrutiny on enterprise discounting. Pair these trends with your own win-loss analysis to refine packaging strategy.",
        signals,
        evidence,
        tags: ["pricing", "packaging", "discounts"],
      }),
    ];
  }
}
