import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { runVideoExplainer } from "@nova/video-agents";
import type { VideoType } from "@nova/video-agents";
import { loadProvidersConfig } from "./config.js";
import { createClientsFromConfig } from "./clients.js";

interface CliOptions {
  videoType: VideoType;
  clientName?: string;
  clientIndustry?: string;
  clientPainPoints?: string[];
  outputDir: string;
  configPath?: string;
  pollIntervalMs: number;
  timeoutMs: number;
}

function readArg(flag: string, fallback?: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

function readList(flag: string, fallback: string[] = []): string[] {
  const raw = readArg(flag);
  if (!raw) return fallback;
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function buildOptions(): CliOptions {
  const videoType = (readArg("--type", "generic") ?? "generic") as VideoType;
  return {
    videoType,
    clientName: readArg("--client"),
    clientIndustry: readArg("--industry"),
    clientPainPoints: readList("--pain-points"),
    outputDir: readArg("--output", "./data") ?? "./data",
    configPath: readArg("--config"),
    pollIntervalMs: parseInt(readArg("--poll-interval", "10000") ?? "10000", 10),
    timeoutMs: parseInt(readArg("--timeout", "600000") ?? "600000", 10),
  };
}

async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

async function writeJson(path: string, payload: unknown) {
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

async function run() {
  const options = buildOptions();
  const { config, resolvedPath } = await loadProvidersConfig(options.configPath);
  const clients = createClientsFromConfig(config);

  if (resolvedPath) {
    process.stdout.write(`Loaded providers config: ${resolvedPath}\n`);
  } else {
    process.stdout.write("No providers config found. Using mock clients.\n");
  }

  process.stdout.write(
    `Generating ${options.videoType} video${options.clientName ? ` for ${options.clientName}` : ""}...\n`
  );

  const report = await runVideoExplainer(
    {
      videoType: options.videoType,
      outputDir: join(options.outputDir, "audio"),
      clientProfile: options.clientName
        ? {
            name: options.clientName,
            industry: options.clientIndustry,
            painPoints: options.clientPainPoints?.length
              ? options.clientPainPoints
              : undefined,
          }
        : undefined,
      clients,
    },
    {
      heygenPollIntervalMs: options.pollIntervalMs,
      heygenTimeoutMs: options.timeoutMs,
    }
  );

  // Write outputs
  const reportsDir = join(options.outputDir, "reports");
  await ensureDir(reportsDir);

  const fileName = `${report.generatedAt.replace(/[:.]/g, "-")}-${report.id}.json`;
  const reportPath = join(reportsDir, fileName);

  await writeJson(reportPath, report);
  await writeJson(join(options.outputDir, "latest.json"), report);
  await writeJson(join(options.outputDir, "manifest.json"), {
    schemaVersion: "1.0",
    latestReport: fileName,
    generatedAt: report.generatedAt,
    videoType: report.videoType,
    clientName: report.clientName,
    videoUrl: report.video?.videoUrl,
  });

  if (report.summary.succeeded) {
    process.stdout.write(`\nPipeline completed successfully!\n`);
    if (report.script) {
      process.stdout.write(
        `  Script: ${report.script.sections.length} sections, ${report.script.totalDurationSeconds}s\n`
      );
    }
    if (report.voiceover) {
      process.stdout.write(`  Audio: ${report.voiceover.audioPath}\n`);
    }
    if (report.video) {
      process.stdout.write(`  Video: ${report.video.videoUrl}\n`);
    }
    process.stdout.write(`  Report: ${reportPath}\n`);
  } else {
    process.stderr.write(
      `\nPipeline failed at stage: ${report.summary.failedAtStage}\n`
    );
    const failedRun = report.stageRuns.find((r) => r.errors.length > 0);
    if (failedRun) {
      process.stderr.write(`  Errors: ${failedRun.errors.join(", ")}\n`);
    }
    process.stderr.write(`  Report: ${reportPath}\n`);
    process.exit(1);
  }
}

run().catch((error) => {
  process.stderr.write(
    `Video explainer failed: ${error instanceof Error ? error.message : "Unknown error"}\n`
  );
  process.exit(1);
});
