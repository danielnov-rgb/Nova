import { Insight } from "../types";

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function dedupeInsights(insights: Insight[]): Insight[] {
  const seen = new Set<string>();
  const output: Insight[] = [];

  for (const insight of insights) {
    const key = `${insight.category}:${normalize(insight.title)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(insight);
  }

  return output;
}
