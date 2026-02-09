import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateCompetitorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  strengths?: string[];

  @IsOptional()
  @IsArray()
  weaknesses?: string[];

  @IsOptional()
  @IsObject()
  pricing?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  solutions?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCompetitorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  strengths?: string[];

  @IsOptional()
  @IsArray()
  weaknesses?: string[];

  @IsOptional()
  @IsObject()
  pricing?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  solutions?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
