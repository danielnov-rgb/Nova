import { Command } from 'commander';
import chalk from 'chalk';
import { discoverCommand } from './commands/discover.js';
import { authCommand } from './commands/auth.js';
import { getConfig } from './config.js';

const program = new Command();

program
  .name('nova-agent')
  .description('CLI tool for automated feature discovery and Nova plugin instrumentation')
  .version('0.1.0');

// Auth command
program
  .command('auth')
  .description('Authenticate with Nova API')
  .option('--api-key <key>', 'Nova API key')
  .option('--endpoint <url>', 'Nova API endpoint', 'http://localhost:3001/api')
  .action(authCommand);

// Discover command
program
  .command('discover [path]')
  .description('Discover features in a codebase')
  .option('-f, --framework <framework>', 'Framework (react, nextjs, vue, angular)')
  .option('-d, --dry-run', 'Preview without making changes')
  .option('-s, --sync', 'Sync discovered features to Nova API')
  .option('-i, --instrument', 'Add Nova plugin tracking code')
  .option('-b, --branch <name>', 'Git branch name', 'nova/feature-instrumentation')
  .option('-o, --output <file>', 'Output results to JSON file')
  .action(discoverCommand);

// Show config
program
  .command('config')
  .description('Show current configuration')
  .action(() => {
    const config = getConfig();
    console.log(chalk.bold('\nNova Agent Configuration:\n'));
    console.log(`  API Endpoint: ${chalk.cyan(config.apiEndpoint)}`);
    console.log(`  API Key: ${config.apiKey ? chalk.green('configured') : chalk.yellow('not set')}`);
    console.log(`  Default Branch: ${chalk.cyan(config.defaultBranch)}`);
    console.log();
  });

program.parse();
