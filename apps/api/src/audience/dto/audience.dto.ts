import { IsString, IsOptional, IsObject, IsEnum, IsArray } from 'class-validator';

export enum TargetAudienceType {
  EXISTING = 'EXISTING',
  TARGET = 'TARGET',
  MARKET = 'MARKET',
}

export class CreateAudienceDto {
  @IsString()
  name: string;

  @IsEnum(TargetAudienceType)
  type: TargetAudienceType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  segments?: SegmentDefinition[];

  @IsOptional()
  @IsObject()
  targets?: Record<string, number>;
}

export class UpdateAudienceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(TargetAudienceType)
  type?: TargetAudienceType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  segments?: SegmentDefinition[];

  @IsOptional()
  @IsObject()
  targets?: Record<string, number>;
}

export interface SegmentDefinition {
  name: string;
  description?: string;
  demographics?: {
    ageRange?: string;
    location?: string;
    income?: string;
    profession?: string;
    industry?: string;
  };
  size?: number;
  notes?: string;
}
