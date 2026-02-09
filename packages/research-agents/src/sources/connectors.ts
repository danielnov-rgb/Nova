import {
  DatasetClient,
  DatasetMetric,
  SearchClient,
  SearchOptions,
  SearchResult,
} from "../types";
import { mockDataset, mockInternalDataset, mockSearchIndex } from "./mock-data";

function matchKeywords(query: string, keywords: string[]): boolean {
  const normalized = query.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

export class MockSearchClient implements SearchClient {
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const results = mockSearchIndex
      .filter((entry) => matchKeywords(query, entry.keywords))
      .flatMap((entry) => entry.results);

    const limited = options.limit ? results.slice(0, options.limit) : results;
    return Promise.resolve(limited);
  }
}

export class MockDatasetClient implements DatasetClient {
  private readonly data: DatasetMetric[];

  constructor(data: DatasetMetric[] = mockDataset) {
    this.data = data;
  }

  async getMetric(key: string): Promise<DatasetMetric | null> {
    const metric = this.data.find((item) => item.key === key);
    return metric ?? null;
  }
}

export function createDefaultClients() {
  return {
    search: new MockSearchClient(),
    datasets: new MockDatasetClient(),
    internal: new MockDatasetClient(mockInternalDataset),
  };
}
