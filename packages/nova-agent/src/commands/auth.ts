import chalk from 'chalk';
import ora from 'ora';
import { setApiKey, setApiEndpoint, getConfig } from '../config.js';

interface AuthOptions {
  apiKey?: string;
  endpoint?: string;
}

export async function authCommand(options: AuthOptions): Promise<void> {
  const { apiKey, endpoint } = options;

  if (!apiKey) {
    console.log(chalk.red('Error: --api-key is required'));
    console.log(chalk.gray('\nUsage: nova-agent auth --api-key <your-api-key>'));
    console.log(chalk.gray('\nYou can find your API key in the Nova admin dashboard under Plugin > API Key'));
    process.exit(1);
  }

  // Update endpoint if provided
  if (endpoint) {
    setApiEndpoint(endpoint);
  }

  // Save the API key
  setApiKey(apiKey);

  const config = getConfig();

  console.log(chalk.green('\n✓ API key saved'));
  console.log(chalk.gray(`  Endpoint: ${config.apiEndpoint}`));
  console.log(chalk.gray('\nYou can now run: nova-agent discover'));
}
