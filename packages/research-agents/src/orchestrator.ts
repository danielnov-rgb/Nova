import { randomUUID } from "node:crypto";
import {
  AgentRun,
  Insight,
  OrchestratorOptions,
  ReportContext,
  ResearchAgent,
  ResearchContext,
  ResearchReport,
} from "./types";
import { INSIGHT_CATEGORIES } from "./taxonomy";
import { dedupeInsights } from "./utils/dedupe";
import { toIsoString } from "./utils/time";

async function runWithConcurrency<T>(
  items: Array<() => Promise<T>>,
  maxConcurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const queue = items.slice();
  let running = 0;

  return new Promise((resolve, reject) => {
    const launchNext = () => {
      if (queue.length === 0 && running === 0) {
        resolve(results);
        return;
      }

      while (running < maxConcurrency && queue.length > 0) {
        const task = queue.shift();
        if (!task) return;
        running += 1;
        task()
          .then((result) => {
            results.push(result);
          })
          .catch(reject)
          .finally(() => {
            running -= 1;
            launchNext();
          });
      }
    };

    launchNext();
  });
}

function buildReportContext(context: ResearchContext): ReportContext {
  return {
    markets: context.markets,
    industries: context.industries,
    horizon: context.horizon,
    focusAreas: context.focusAreas,
  };
}

export class ResearchOrchestrator {
  private readonly agents: ResearchAgent[];
  private readonly options: OrchestratorOptions;

  constructor(agents: ResearchAgent[], options: OrchestratorOptions = {}) {
    this.agents = agents;
    this.options = options;
  }

  async run(context: ResearchContext): Promise<ResearchReport> {
    const maxConcurrency = this.options.maxConcurrency ?? 3;
    const tasks = this.agents.map((agent) => () => agent.run(context));
    const agentRuns: AgentRun[] = await runWithConcurrency(tasks, maxConcurrency);

    const insights = dedupeInsights(agentRuns.flatMap((run) => run.insights));
    const summary = this.buildSummary(insights, agentRuns);

    return {
      id: randomUUID(),
      generatedAt: toIsoString(context.now),
      context: buildReportContext(context),
      agentRuns,
      insights,
      summary,
    };
  }

  private buildSummary(insights: Insight[], runs: AgentRun[]) {
    const byCategory = Object.keys(INSIGHT_CATEGORIES).reduce((acc, key) => {
      acc[key as Insight["category"]] = 0;
      return acc;
    }, {} as Record<Insight["category"], number>);

    for (const insight of insights) {
      byCategory[insight.category] = (byCategory[insight.category] ?? 0) + 1;
    }

    return {
      totalInsights: insights.length,
      byCategory: byCategory as Record<Insight["category"], number>,
      errors: runs.reduce((sum, run) => sum + run.errors.length, 0),
    };
  }
}
