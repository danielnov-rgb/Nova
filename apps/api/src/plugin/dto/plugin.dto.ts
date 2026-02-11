import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsInt,
  IsEnum,
  ValidateNested,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// EVENT TYPES
// ============================================================================

export enum EventType {
  FEATURE_VIEW = 'FEATURE_VIEW',
  FEATURE_INTERACT = 'FEATURE_INTERACT',
  FEATURE_COMPLETE = 'FEATURE_COMPLETE',
  FEATURE_ERROR = 'FEATURE_ERROR',
  FEATURE_EXIT = 'FEATURE_EXIT',
  PAGE_VIEW = 'PAGE_VIEW',
  CUSTOM = 'CUSTOM',
}

// ============================================================================
// EVENT INGESTION DTOs
// ============================================================================

export class EventDto {
  @IsEnum(EventType)
  eventType: EventType;

  @IsString()
  eventName: string;

  @IsString()
  @IsOptional()
  featureId?: string;

  @IsString()
  sessionId: string;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsString()
  @IsOptional()
  pageUrl?: string;

  @IsString()
  @IsOptional()
  referrer?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  occurredAt?: string; // ISO timestamp
}

export class IngestEventsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  events: EventDto[];
}

export class IngestEventsResponse {
  accepted: number;
  rejected: number;
  errors?: string[];
}

// ============================================================================
// PLUGIN CONFIG DTOs
// ============================================================================

export class UpdatePluginConfigDto {
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedOrigins?: string[];

  @IsInt()
  @Min(10)
  @Max(1000)
  @IsOptional()
  eventsPerMinute?: number;
}

export class PluginConfigResponse {
  id: string;
  tenantId: string;
  apiKey: string;
  isEnabled: boolean;
  allowedOrigins: string[];
  eventsPerMinute: number;
  createdAt: Date;
  updatedAt: Date;
}

export class RotateApiKeyResponse {
  apiKey: string;
  message: string;
}
