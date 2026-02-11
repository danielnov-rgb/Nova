import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import { detectFramework } from '../analyzers/detect.js';
import { analyzeNextJs } from '../analyzers/nextjs.js';
import { generatePluginCode } from '../generators/plugin-code.js';
import { syncToNova } from '../api/nova-client.js';
import { createGitBranch } from '../git/workflow.js';
import { getConfig } from '../config.js';
import type { AnalysisResult, Framework, DiscoveredFeature, FileChange } from '../types.js';

interface DiscoverOptions {
  framework?: Framework;
  dryRun?: boolean;
  sync?: boolean;
  instrument?: boolean;
  branch: string;
  output?: string;
}

export async function discoverCommand(
  targetPath: string = '.',
  options: DiscoverOptions
): Promise<void> {
  const rootDir = path.resolve(targetPath);

  // Validate directory exists
  if (!fs.existsSync(rootDir)) {
    console.log(chalk.red(`Error: Directory not found: ${rootDir}`));
    process.exit(1);
  }

  console.log(chalk.bold(`\n🔍 Nova Agent - Feature Discovery\n`));
  console.log(chalk.gray(`   Target: ${rootDir}`));
  console.log(chalk.gray(`   Mode: ${options.dryRun ? 'Dry Run (preview only)' : 'Live'}`));
  console.log();

  // Step 1: Detect framework
  const spinner = ora('Detecting framework...').start();
  let framework: Framework;

  try {
    framework = options.framework || (await detectFramework(rootDir));
    spinner.succeed(`Framework detected: ${chalk.cyan(framework)}`);
  } catch (error) {
    spinner.fail('Could not detect framework');
    console.log(chalk.red(`\n${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }

  // Step 2: Analyze codebase
  const analyzeSpinner = ora('Analyzing codebase...').start();
  let result: AnalysisResult;

  try {
    switch (framework) {
      case 'nextjs':
      case 'react':
        result = await analyzeNextJs(rootDir, framework);
        break;
      default:
        analyzeSpinner.fail(`Framework not yet supported: ${framework}`);
        console.log(chalk.yellow('\nCurrently supported: nextjs, react'));
        process.exit(1);
    }

    analyzeSpinner.succeed(
      `Found ${chalk.green(result.stats.totalFeatures)} features across ${chalk.green(result.stats.totalPages)} pages`
    );
  } catch (error) {
    analyzeSpinner.fail('Analysis failed');
    console.log(chalk.red(`\n${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }

  // Step 3: Display results
  displayFeatureTable(result.features);

  // Output to file if requested
  if (options.output) {
    fs.writeFileSync(options.output, JSON.stringify(result, null, 2));
    console.log(chalk.gray(`\n📄 Results saved to: ${options.output}`));
  }

  // If dry run, stop here
  if (options.dryRun) {
    console.log(chalk.yellow('\n⚠️  Dry run mode - no changes made'));
    console.log(chalk.gray('   Remove --dry-run to apply changes'));
    return;
  }

  // Step 4: Sync to Nova API
  if (options.sync) {
    const config = getConfig();
    if (!config.apiKey) {
      console.log(chalk.red('\n❌ Not authenticated. Run: nova-agent auth --api-key <key>'));
      process.exit(1);
    }

    const syncSpinner = ora('Syncing features to Nova...').start();
    try {
      const syncResult = await syncToNova(result.features, config);
      syncSpinner.succeed(
        `Synced to Nova: ${chalk.green(syncResult.created)} created, ${chalk.blue(syncResult.updated)} updated`
      );
    } catch (error) {
      syncSpinner.fail('Sync failed');
      console.log(chalk.red(`\n${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  // Step 5: Generate plugin code
  if (options.instrument) {
    const genSpinner = ora('Generating plugin integration code...').start();
    try {
      const changes = await generatePluginCode(rootDir, result, framework);
      genSpinner.succeed(`Generated ${chalk.green(changes.length)} file changes`);

      // Display changes
      console.log(chalk.bold('\nChanges to be applied:'));
      for (const change of changes) {
        const icon = change.operation === 'create' ? '➕' : '📝';
        console.log(`  ${icon} ${chalk.cyan(change.path)}`);
        console.log(chalk.gray(`     ${change.description}`));
      }

      // Step 6: Git workflow
      const gitSpinner = ora(`Creating git branch: ${options.branch}...`).start();
      try {
        await createGitBranch(rootDir, options.branch, changes);
        gitSpinner.succeed(`Created and pushed branch: ${chalk.green(options.branch)}`);

        console.log(chalk.bold('\n✅ Done!\n'));
        console.log(chalk.green('Next steps:'));
        console.log(`  1. Create a PR from branch: ${chalk.cyan(options.branch)}`);
        console.log(`  2. Add ${chalk.cyan('NEXT_PUBLIC_NOVA_API_KEY')} to your environment`);
        console.log(`  3. Review and merge the changes`);
      } catch (error) {
        gitSpinner.fail('Git operation failed');
        console.log(chalk.red(`\n${error instanceof Error ? error.message : 'Unknown error'}`));
        console.log(chalk.gray('\nChanges were generated but not committed.'));
      }
    } catch (error) {
      genSpinner.fail('Code generation failed');
      console.log(chalk.red(`\n${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  if (!options.sync && !options.instrument) {
    console.log(chalk.gray('\n💡 Tip: Use --sync to push features to Nova, --instrument to add tracking code'));
  }
}

function displayFeatureTable(features: DiscoveredFeature[]): void {
  console.log(chalk.bold('\nDiscovered Features:\n'));

  const table = new Table({
    head: [
      chalk.white('Feature ID'),
      chalk.white('Name'),
      chalk.white('Type'),
      chalk.white('Interactions'),
    ],
    style: {
      head: [],
      border: [],
    },
  });

  for (const feature of features.slice(0, 30)) {
    table.push([
      chalk.cyan(feature.featureId),
      feature.name,
      chalk.gray(feature.type),
      feature.interactions.length > 0 ? chalk.yellow(feature.interactions.join(', ')) : chalk.gray('-'),
    ]);
  }

  console.log(table.toString());

  if (features.length > 30) {
    console.log(chalk.gray(`\n  ... and ${features.length - 30} more features`));
  }

  console.log(chalk.gray(`\n  Total: ${features.length} features`));
}
