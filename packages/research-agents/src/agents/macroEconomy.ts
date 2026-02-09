import { BaseAgent } from "./base";
import { Insight, ResearchContext } from "../types";

export class MacroEconomyAgent extends BaseAgent {
  constructor() {
    super({
      id: "macro-economy",
      name: "Macro Economy",
      description: "Tracks macro and enterprise spend indicators",
      categories: ["macro-economy"],
    });
  }

  protected async buildInsights(context: ResearchContext): Promise<Insight[]> {
    const results = await this.search(context, [
      "enterprise tech spending outlook",
      "macro indicators software demand",
    ]);

    const evidence = this.createEvidence(results);

    return [
      this.buildInsight({
        category: "macro-economy",
        title: "Enterprise spend headwinds and tailwinds",
        summary:
          "Macro indicators impact procurement cycles, budget approvals, and enterprise software demand. Track these signals alongside pipeline velocity to adjust go-to-market timing.",
        signals: [],
        evidence,
        tags: ["macro", "enterprise", "spend"],
      }),
    ];
  }
}
