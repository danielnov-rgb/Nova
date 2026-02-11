import type {
  DiscoveredFeature,
  NovaAgentConfig,
  BulkImportDto,
  BulkImportResult,
} from '../types.js';

export async function syncToNova(
  features: DiscoveredFeature[],
  config: NovaAgentConfig
): Promise<BulkImportResult> {
  if (!config.apiKey) {
    throw new Error('API key not configured. Run: nova-agent auth --api-key <key>');
  }

  const dto: BulkImportDto = {
    features: features.map((f) => ({
      featureId: f.featureId,
      name: f.name,
      description: f.description,
      parentFeatureId: f.parentFeatureId,
      codeLocations: f.codeLocations,
      tags: f.tags,
      status: 'ACTIVE',
    })),
    options: {
      updateExisting: true, // Upsert mode
    },
  };

  // Use the plugin endpoint with x-nova-api-key header
  const response = await fetch(`${config.apiEndpoint}/plugin/features/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-nova-api-key': config.apiKey,
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(`Failed to sync features: ${error.message || response.statusText}`);
  }

  const result: BulkImportResult = await response.json();
  return result;
}

export async function validateApiKey(config: NovaAgentConfig): Promise<boolean> {
  if (!config.apiKey) {
    return false;
  }

  try {
    const response = await fetch(`${config.apiEndpoint}/auth/me`, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}
