/**
 * Nova Agent Types
 */

export type Framework = 'nextjs' | 'react' | 'vue' | 'nuxt' | 'angular' | 'unknown';

export type FeatureType = 'page' | 'section' | 'component' | 'form' | 'action' | 'modal';

export interface CodeLocation {
  repo?: string;
  filePath: string;
  lineRange?: string;
  branch?: string;
}

export interface DiscoveredFeature {
  featureId: string;
  name: string;
  description?: string;
  type: FeatureType;
  parentFeatureId?: string;
  codeLocations: CodeLocation[];
  tags: string[];
  interactions: string[];
}

export interface ComponentInfo {
  name: string;
  filePath: string;
  exports: string[];
  hooks: string[];
  interactions: string[]; // onClick, onSubmit, etc.
  childComponents: string[];
  hasForm: boolean;
  jsDocComment?: string;
}

export interface PageInfo {
  route: string;
  filePath: string;
  featureId: string;
  name: string;
  components: ComponentInfo[];
}

export interface AnalysisResult {
  framework: Framework;
  rootDir: string;
  pages: PageInfo[];
  features: DiscoveredFeature[];
  stats: {
    totalPages: number;
    totalComponents: number;
    totalFeatures: number;
    totalInteractions: number;
  };
}

export interface FileChange {
  path: string;
  content: string;
  operation: 'create' | 'modify';
  description: string;
}

export interface NovaAgentConfig {
  apiKey?: string;
  apiEndpoint: string;
  defaultBranch: string;
}

export interface BulkImportDto {
  features: {
    featureId: string;
    name: string;
    description?: string;
    parentFeatureId?: string;
    codeLocations: CodeLocation[];
    tags?: string[];
    status?: 'DRAFT' | 'ACTIVE';
  }[];
  options?: {
    updateExisting?: boolean;
  };
}

export interface BulkImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: { featureId: string; error: string }[];
}
