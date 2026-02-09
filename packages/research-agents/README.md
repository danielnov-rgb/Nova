# Research Agents (Nova)

This package scaffolds a research-orchestration layer for Nova's market intelligence system. It is designed to run multiple specialized agents that collect, normalize, and score signals used by product strategy and innovation teams.

## What this is
- A lightweight orchestrator that runs multiple research agents with shared context
- Agent modules for SaaS benchmarks, pricing intelligence, adoption signals, macro trends, and consumer spend
- A data model optimized for dashboards: insights, signals, evidence, and confidence scores

## What this is not (yet)
- A full crawler. The default clients are mock connectors for development and UI testing, but HTTP-based providers are supported.
- A persistence layer. Results are returned in-memory for now.

## Quick start
```ts
import { runTrendIntel } from "@nova/research-agents";

const report = await runTrendIntel({
  markets: ["US", "EU"],
  industries: ["B2B SaaS"],
  horizon: "12m",
  focusAreas: ["pricing", "adoption", "enterprise spend"],
});

console.log(report.insights);
```

## How to extend
- Add a new agent under `src/agents/` and register it in `src/pipelines/trend-intel.ts`.
- Replace `MockSearchClient` and `MockDatasetClient` with production connectors (see `HttpSearchClient` and `HttpDatasetClient`).
- Write insights to storage or your analytics warehouse by consuming the `ResearchReport` output.

## Notes on data sources
The design intentionally supports multiple data tiers:
- Public web and paid datasets
- Nova-owned datasets
- Client-proprietary datasets

Keep these sources logically separated to preserve privacy and compliance rules.
