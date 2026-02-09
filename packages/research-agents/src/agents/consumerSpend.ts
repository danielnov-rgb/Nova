import { BaseAgent } from "./base";
import { Insight, ResearchContext, Signal } from "../types";

export class ConsumerSpendAgent extends BaseAgent {
  constructor() {
    super({
      id: "consumer-spend",
      name: "Consumer Spend",
      description: "Tracks disposable income and spend allocation trends",
      categories: ["consumer-spend"],
    });
  }

  protected async buildInsights(context: ResearchContext): Promise<Insight[]> {
    const results = await this.search(context, [
      "disposable income trends subscription spend",
      "consumer spend allocation budget pressure",
    ]);

    const evidence = this.createEvidence(results);
    const signals: Signal[] = [];

    const pressure = await context.clients.datasets.getMetric(
      "disposable_income_pressure"
    );

    if (pressure) {
      signals.push({
        key: pressure.key,
        label: pressure.label,
        value: pressure.value,
        source: pressure.source,
        timeframe: "last 12 months",
      });
    }

    return [
      this.buildInsight({
        category: "consumer-spend",
        title: "Disposable income pressure and subscription risk",
        summary:
          "Disposable income signals influence churn risk and willingness to adopt new subscriptions. Pair spend pressure with cohort health to anticipate pricing sensitivity.",
        signals,
        evidence,
        tags: ["consumer", "spend", "budget"],
      }),
    ];
  }
}
