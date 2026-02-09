import {
  createDefaultClients,
  HttpDatasetClient,
  HttpSearchClient,
} from "@nova/research-agents";
import { ProvidersConfig } from "./config";

export function createClientsFromConfig(config: ProvidersConfig | null) {
  const fallback = createDefaultClients();
  if (!config) return fallback;

  return {
    search: config.search ? new HttpSearchClient(config.search) : fallback.search,
    datasets: config.datasets
      ? new HttpDatasetClient(config.datasets)
      : fallback.datasets,
    internal: config.internal
      ? new HttpDatasetClient(config.internal)
      : fallback.internal,
  };
}
