import { AdoptionSignalsAgent } from "../agents/adoptionSignals";
import { ConsumerSpendAgent } from "../agents/consumerSpend";
import { InternalPerformanceAgent } from "../agents/internalPerformance";
import { MacroEconomyAgent } from "../agents/macroEconomy";
import { PricingIntelAgent } from "../agents/pricingIntel";
import { SaasBenchmarksAgent } from "../agents/saasBenchmarks";
import { SourceScoutAgent } from "../agents/sourceScout";
import { ResearchOrchestrator } from "../orchestrator";
import { ResearchContext } from "../types";
import { createDefaultClients } from "../sources/connectors";

export function createTrendIntelContext(
  overrides: Partial<ResearchContext> = {}
): ResearchContext {
  return {
    now: overrides.now ?? new Date(),
    markets: overrides.markets ?? ["US"],
    industries: overrides.industries ?? ["B2B SaaS"],
    horizon: overrides.horizon ?? "12m",
    focusAreas: overrides.focusAreas ?? [
      "pricing",
      "adoption",
      "benchmarks",
      "macro",
      "consumer spend",
    ],
    clients: overrides.clients ?? createDefaultClients(),
  };
}

export function createTrendIntelOrchestrator() {
  return new ResearchOrchestrator([
    new SaasBenchmarksAgent(),
    new PricingIntelAgent(),
    new AdoptionSignalsAgent(),
    new MacroEconomyAgent(),
    new ConsumerSpendAgent(),
    new InternalPerformanceAgent(),
    new SourceScoutAgent(),
  ]);
}

export async function runTrendIntel(overrides: Partial<ResearchContext> = {}) {
  const context = createTrendIntelContext(overrides);
  const orchestrator = createTrendIntelOrchestrator();
  return orchestrator.run(context);
}
