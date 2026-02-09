# Research Intel Service

This service runs Nova's research-agent pipeline as an **independent process** and writes structured insight data to disk. The output is designed to be consumed by dashboards and BI views.

## What it does
1. Runs the research agent orchestration pipeline.
2. Writes a JSON report to `data/reports/`.
3. Writes `data/latest.json` and `data/manifest.json` for easy consumption.

## Run locally
```bash
pnpm --filter @nova/research-intel build
pnpm --filter @nova/research-intel start -- --output ./data --markets US,EU --industries "B2B SaaS" --horizon 12m --focus pricing,adoption,benchmarks,macro,consumer-spend
```

## Live data providers
To use real web/dataset sources, create `config/providers.json` by copying the example:
```
cp config/providers.example.json config/providers.json
```

Then edit the file with your provider endpoints, API keys, and JSON paths. The service will fall back to mock data if no config is present.

Run with a custom config path:
```bash
pnpm --filter @nova/research-intel start -- --config ./config/providers.json
```

## Output files
- `data/reports/<timestamp>-<id>.json`
- `data/latest.json`
- `data/manifest.json`

## Consumption guide
See `docs/consumption.md` for display instructions and data semantics.
