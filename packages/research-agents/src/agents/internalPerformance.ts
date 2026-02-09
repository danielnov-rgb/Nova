import { BaseAgent } from "./base";
import { Insight, ResearchContext, Signal } from "../types";

export class InternalPerformanceAgent extends BaseAgent {
  constructor() {
    super({
      id: "internal-performance",
      name: "Internal Performance",
      description: "Summarizes proprietary Nova or client performance benchmarks",
      categories: ["internal-performance"],
    });
  }

  protected async buildInsights(context: ResearchContext): Promise<Insight[]> {
    const signals: Signal[] = [];

    const activation = await context.clients.internal.getMetric(
      "internal_activation_rate"
    );

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
        category: "internal-performance",
        title: "Internal benchmark highlights",
        summary:
          "Internal benchmarks surface how similar products perform on activation and early retention. Use these to calibrate targets against real customer portfolios.",
        signals,
        evidence: [],
        tags: ["internal", "benchmarks", "activation"],
      }),
    ];
  }
}
