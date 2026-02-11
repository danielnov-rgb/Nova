import Conf from 'conf';
import type { NovaAgentConfig } from './types.js';

const config = new Conf<NovaAgentConfig>({
  projectName: 'nova-agent',
  defaults: {
    apiEndpoint: 'http://localhost:3001/api',
    defaultBranch: 'nova/feature-instrumentation',
  },
});

export function getConfig(): NovaAgentConfig {
  return {
    apiKey: config.get('apiKey'),
    apiEndpoint: config.get('apiEndpoint'),
    defaultBranch: config.get('defaultBranch'),
  };
}

export function setApiKey(apiKey: string): void {
  config.set('apiKey', apiKey);
}

export function setApiEndpoint(endpoint: string): void {
  config.set('apiEndpoint', endpoint);
}

export function clearConfig(): void {
  config.clear();
}
