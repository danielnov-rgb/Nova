# Research Intel Consumption Guide

## Files
1. `data/latest.json` is the newest report for dashboards and local development.
2. `data/reports/<timestamp>-<id>.json` is the immutable historical report.
3. `data/manifest.json` contains the latest report filename and timestamp.

## High-level schema
The output JSON has a stable top-level envelope:
- `schemaVersion`: version for the report shape.
- `report`: the raw research report from the agent pipeline.
- `displayHints`: recommended visualization hints for each insight.

## Display mapping
Use `displayHints` to pick layout and visualizations. Match on `insightId`.

Recommended visual mapping by category:
- `saas-benchmarks`: benchmark cards with KPI tiles and peer comparison.
- `pricing-intel`: pricing model matrix plus discount band callouts.
- `adoption`: activation KPI with funnel or cohort chart.
- `macro-economy`: trendline chart with macro indicators.
- `consumer-spend`: index or gauge to represent spend pressure.
- `innovation-trends`: signal list with momentum badges.
- `internal-performance`: private KPI cards.
- `source-scout`: source list with access level and cadence badges.

## Insight fields
Each insight includes:
- `title`: headline for the card.
- `summary`: 1-2 sentences for the main takeaway.
- `signals`: structured metrics used to populate charts and KPIs.
- `evidence`: citations for source transparency.
- `confidence`: 0-1 signal confidence.
- `freshnessDays`: recency of supporting evidence.
- `tags`: filter chips.
- `evidence[].source.access`: `public`, `paid`, or `internal` for governance UI.
 - `signals`: for source-scout items, use `source_access` and `update_cadence`.

## Display hints
Each display hint includes:
- `headline`: suggested section header.
- `primaryMetricKeys`: metric keys to highlight.
- `recommendedVisual`: visual type token used by the UI.
- `supportingNotes`: editorial guidance for the UI.

## Example usage
1. Load `data/latest.json`.
2. Render a category tab per `insights[].category`.
3. For each insight, locate the matching display hint by `insight.id`.
4. Use `signals` to populate KPIs, and use `evidence` for source tooltips.
