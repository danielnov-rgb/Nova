import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

// ============================================================================
// ENUMS (matching Prisma schema)
// ============================================================================

export enum FeatureStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

// ============================================================================
// DTOs
// ============================================================================

export class CreateFeatureDto {
  @IsString()
  featureId: string; // Human-readable ID like 'checkout-payment-form'

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsEnum(FeatureStatus)
  @IsOptional()
  status?: FeatureStatus;

  @IsArray()
  @IsOptional()
  codeLocations?: CodeLocation[];

  @IsArray()
  @IsOptional()
  designFiles?: DesignFile[];

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class UpdateFeatureDto {
  @IsString()
  @IsOptional()
  featureId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsEnum(FeatureStatus)
  @IsOptional()
  status?: FeatureStatus;

  @IsArray()
  @IsOptional()
  codeLocations?: CodeLocation[];

  @IsArray()
  @IsOptional()
  designFiles?: DesignFile[];

  @IsArray()
  @IsOptional()
  tags?: string[];
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface CodeLocation {
  repo: string;
  filePath: string;
  lineRange?: string;
  branch?: string;
}

export interface DesignFile {
  url: string;
  type: string; // 'figma', 'sketch', 'image', etc.
  name: string;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface FeatureResponse {
  id: string;
  tenantId: string;
  featureId: string;
  name: string;
  description: string | null;
  status: FeatureStatus;
  parentId: string | null;
  codeLocations: CodeLocation[];
  designFiles: DesignFile[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  children?: FeatureResponse[];
  parent?: FeatureResponse;
  _count?: {
    analyticsEvents: number;
    children: number;
  };
}

export interface FeatureTreeNode extends FeatureResponse {
  children: FeatureTreeNode[];
}

// ============================================================================
// BULK IMPORT DTOs
// ============================================================================

export interface BulkImportFeatureDto {
  featureId: string;
  name: string;
  description?: string;
  parentFeatureId?: string; // Reference by featureId, not database ID
  codeLocations?: CodeLocation[];
  designFiles?: DesignFile[];
  tags?: string[];
  status?: FeatureStatus;
}

export interface BulkImportOptions {
  updateExisting?: boolean;  // Update if featureId exists (default: true)
  skipConflicts?: boolean;   // Skip rather than error on conflict
}

export class BulkImportFeaturesDto {
  @IsArray()
  features: BulkImportFeatureDto[];

  @IsOptional()
  options?: BulkImportOptions;
}

export interface BulkImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: { featureId: string; error: string }[];
}
