import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildDisplayHints } from "./display";
import { runTrendIntel, ResearchReport } from "@nova/research-agents";
import { loadProvidersConfig } from "./config";
import { createClientsFromConfig } from "./clients";

interface CliOptions {
  outputDir: string;
  markets: string[];
  industries: string[];
  horizon: string;
  focusAreas: string[];
  configPath?: string;
}

interface IntelOutput {
  schemaVersion: "1.0";
  report: ResearchReport;
  displayHints: ReturnType<typeof buildDisplayHints>;
}

function readArg(flag: string, fallback?: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

function readList(flag: string, fallback: string[]): string[] {
  const raw = readArg(flag);
  if (!raw) return fallback;
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function buildOptions(): CliOptions {
  return {
    outputDir: readArg("--output", "./data") ?? "./data",
    markets: readList("--markets", ["US"]),
    industries: readList("--industries", ["B2B SaaS"]),
    horizon: readArg("--horizon", "12m") ?? "12m",
    focusAreas: readList("--focus", [
      "pricing",
      "adoption",
      "benchmarks",
      "macro",
      "consumer spend",
    ]),
    configPath: readArg("--config"),
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
    process.stdout.write("No providers config found. Using mock connectors.\n");
  }

  const report = await runTrendIntel({
    markets: options.markets,
    industries: options.industries,
    horizon: options.horizon,
    focusAreas: options.focusAreas,
    clients,
  });

  const output: IntelOutput = {
    schemaVersion: "1.0",
    report,
    displayHints: buildDisplayHints(report.insights),
  };

  const reportsDir = join(options.outputDir, "reports");
  await ensureDir(reportsDir);

  const fileName = `${report.generatedAt.replace(/[:.]/g, "-")}-${report.id}.json`;
  const reportPath = join(reportsDir, fileName);
  const latestPath = join(options.outputDir, "latest.json");
  const manifestPath = join(options.outputDir, "manifest.json");

  await writeJson(reportPath, output);
  await writeJson(latestPath, output);
  await writeJson(manifestPath, {
    schemaVersion: output.schemaVersion,
    latestReport: fileName,
    generatedAt: report.generatedAt,
  });

  process.stdout.write(`Report written to ${reportPath}\n`);
}

run().catch((error) => {
  process.stderr.write(`Research intel failed: ${error instanceof Error ? error.message : "Unknown error"}\n`);
  process.exit(1);
});
