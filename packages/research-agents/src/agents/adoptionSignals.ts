import { BaseAgent } from "./base";
import { Insight, ResearchContext, Signal } from "../types";

export class AdoptionSignalsAgent extends BaseAgent {
  constructor() {
    super({
      id: "adoption-signals",
      name: "Adoption Signals",
      description: "Measures activation, retention, and adoption benchmarks",
      categories: ["adoption"],
    });
  }

  protected async buildInsights(context: ResearchContext): Promise<Insight[]> {
    const results = await this.search(context, [
      "product activation benchmarks",
      "b2b saas retention curves",
    ]);

    const evidence = this.createEvidence(results);
    const signals: Signal[] = [];

    const activation = await context.clients.datasets.getMetric("activation_rate_median");

    if (activation) {
      signals.push({
        key: activation.key,
        label: activation.label,
        value: activation.value,
        unit: activation.unit,
        source: activation.source,
        timeframe: "last 12 months",
      });
    }

    return [
      this.buildInsight({
        category: "adoption",
        title: "Activation and retention expectations",
        summary:
          "Adoption benchmarks suggest how quickly users realize value and what retention curves look like for comparable SaaS categories. Use these to set product-led growth targets.",
        signals,
        evidence,
        tags: ["activation", "retention", "plg"],
      }),
    ];
  }
}
