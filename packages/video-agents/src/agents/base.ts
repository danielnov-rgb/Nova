import type { StageRun } from "../types.js";
import { toIsoString } from "../utils/time.js";

export abstract class BaseVideoAgent<TContext, TOutput> {
  readonly stageId: string;
  readonly stageName: string;
  readonly description: string;

  protected constructor(options: {
    stageId: string;
    stageName: string;
    description: string;
  }) {
    this.stageId = options.stageId;
    this.stageName = options.stageName;
    this.description = options.description;
  }

  async run(context: TContext): Promise<StageRun<TOutput>> {
    const startedAt = new Date();
    try {
      const output = await this.buildOutput(context);
      return {
        stageId: this.stageId,
        stageName: this.stageName,
        startedAt: toIsoString(startedAt),
        finishedAt: toIsoString(new Date()),
        output,
        errors: [],
      };
    } catch (error) {
      return {
        stageId: this.stageId,
        stageName: this.stageName,
        startedAt: toIsoString(startedAt),
        finishedAt: toIsoString(new Date()),
        output: null,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  protected abstract buildOutput(context: TContext): Promise<TOutput>;
}
