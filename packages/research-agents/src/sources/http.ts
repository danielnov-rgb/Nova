import {
  DatasetClient,
  DatasetMetric,
  SearchClient,
  SearchOptions,
  SearchResult,
} from "../types";

export interface HttpSearchFieldMap {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
  publishedAt?: string;
}

export interface HttpSearchConfig {
  baseUrl: string;
  queryParam?: string;
  limitParam?: string;
  marketParam?: string;
  recencyParam?: string;
  apiKey?: string;
  apiKeyParam?: string;
  apiKeyHeader?: string;
  headers?: Record<string, string>;
  resultsPath: string;
  fieldMap: HttpSearchFieldMap;
  sourceName?: string;
}

export interface DatasetEndpointConfig {
  key: string;
  label?: string;
  unit?: string;
  source: string;
  url: string;
  valuePath: string;
  updatedAtPath?: string;
}

export interface HttpDatasetConfig {
  apiKey?: string;
  apiKeyParam?: string;
  apiKeyHeader?: string;
  headers?: Record<string, string>;
  metrics: DatasetEndpointConfig[];
}

function normalizePath(path: string): string[] {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);
}

function getPathValue(data: unknown, path: string): unknown {
  if (!path) return undefined;
  const parts = normalizePath(path);
  let current: any = data;

  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part as keyof typeof current];
  }

  return current;
}

function buildUrl(baseUrl: string, params: Record<string, string | undefined>) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (!key || !value) return;
    url.searchParams.set(key, value);
  });
  return url;
}

function buildHeaders(config: {
  apiKey?: string;
  apiKeyHeader?: string;
  headers?: Record<string, string>;
}) {
  const headers = new Headers(config.headers ?? {});
  if (config.apiKey && config.apiKeyHeader) {
    headers.set(config.apiKeyHeader, config.apiKey);
  }
  return headers;
}

export class HttpSearchClient implements SearchClient {
  private readonly config: HttpSearchConfig;

  constructor(config: HttpSearchConfig) {
    this.config = config;
  }

  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const params: Record<string, string | undefined> = {
      [this.config.queryParam ?? "q"]: query,
    };

    if (this.config.limitParam) {
      params[this.config.limitParam] = options.limit?.toString();
    }

    if (this.config.marketParam) {
      params[this.config.marketParam] = options.market;
    }

    if (this.config.recencyParam) {
      params[this.config.recencyParam] = options.recencyDays?.toString();
    }

    if (this.config.apiKeyParam && this.config.apiKey) {
      params[this.config.apiKeyParam] = this.config.apiKey;
    }

    const url = buildUrl(this.config.baseUrl, params);

    const response = await fetch(url, {
      headers: buildHeaders(this.config),
    });

    if (!response.ok) {
      throw new Error(`Search request failed (${response.status})`);
    }

    const payload = await response.json();
    const rawResults = getPathValue(payload, this.config.resultsPath);
    if (!Array.isArray(rawResults)) return [];

    return rawResults
      .map((item) => {
        const title = getPathValue(item, this.config.fieldMap.title);
        const urlValue = getPathValue(item, this.config.fieldMap.url);
        if (!title || !urlValue) return null;

        const snippet =
          this.config.fieldMap.snippet &&
          (getPathValue(item, this.config.fieldMap.snippet) as string | undefined);
        const source =
          this.config.fieldMap.source &&
          (getPathValue(item, this.config.fieldMap.source) as string | undefined);
        const publishedAt =
          this.config.fieldMap.publishedAt &&
          (getPathValue(item, this.config.fieldMap.publishedAt) as string | undefined);

        return {
          title: String(title),
          url: String(urlValue),
          snippet: snippet ? String(snippet) : "",
          source: source ?? this.config.sourceName ?? "Web Search",
          publishedAt,
        } satisfies SearchResult;
      })
      .filter((item): item is SearchResult => Boolean(item));
  }
}

export class HttpDatasetClient implements DatasetClient {
  private readonly config: HttpDatasetConfig;

  constructor(config: HttpDatasetConfig) {
    this.config = config;
  }

  async getMetric(key: string): Promise<DatasetMetric | null> {
    const metric = this.config.metrics.find((entry) => entry.key === key);
    if (!metric) return null;

    const params: Record<string, string | undefined> = {};
    if (this.config.apiKeyParam && this.config.apiKey) {
      params[this.config.apiKeyParam] = this.config.apiKey;
    }

    const url = buildUrl(metric.url, params);

    const response = await fetch(url, {
      headers: buildHeaders(this.config),
    });

    if (!response.ok) {
      throw new Error(`Dataset request failed (${response.status})`);
    }

    const payload = await response.json();
    const value = getPathValue(payload, metric.valuePath);
    if (value === undefined || value === null) return null;

    const updatedAt =
      (metric.updatedAtPath && getPathValue(payload, metric.updatedAtPath)) ??
      new Date().toISOString();

    return {
      key: metric.key,
      label: metric.label ?? metric.key,
      value: typeof value === "object" ? JSON.stringify(value) : value,
      unit: metric.unit,
      updatedAt: typeof updatedAt === "string" ? updatedAt : String(updatedAt),
      source: metric.source,
    };
  }
}
