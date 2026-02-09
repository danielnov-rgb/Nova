import { BaseAgent } from "./base";
import { Insight, ResearchContext, Signal } from "../types";

export class SaasBenchmarksAgent extends BaseAgent {
  constructor() {
    super({
      id: "saas-benchmarks",
      name: "SaaS Benchmarks",
      description: "Collects SaaS ARR ramp, CAC/LTV, and growth benchmarks",
      categories: ["saas-benchmarks", "internal-performance"],
    });
  }

  protected async buildInsights(context: ResearchContext): Promise<Insight[]> {
    const results = await this.search(context, [
      "saas arr ramp benchmarks",
      "saas growth benchmarks cac ltv",
    ]);

    const evidence = this.createEvidence(results);

    const signals: Signal[] = [];
    const arrRamp = await context.clients.datasets.getMetric(
      "arr_time_to_1m_median_months"
    );
    const cacLtv = await context.clients.datasets.getMetric("cac_ltv_ratio_median");

    if (arrRamp) {
      signals.push({
        key: arrRamp.key,
        label: arrRamp.label,
        value: arrRamp.value,
        unit: arrRamp.unit,
        source: arrRamp.source,
        timeframe: "last 12 months",
      });
    }

    if (cacLtv) {
      signals.push({
        key: cacLtv.key,
        label: cacLtv.label,
        value: cacLtv.value,
        source: cacLtv.source,
        timeframe: "last 12 months",
      });
    }

    return [
      this.buildInsight({
        category: "saas-benchmarks",
        title: "ARR ramp and efficiency benchmarks",
        summary:
          "Aggregate benchmarks indicate typical ARR ramp timelines and CAC/LTV efficiency bands for SaaS firms. Combine these with internal benchmarks to set realistic growth targets.",
        signals,
        evidence,
        tags: ["arr", "cac", "ltv", "benchmarks"],
      }),
    ];
  }
}
