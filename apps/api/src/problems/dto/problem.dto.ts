import { IsString, IsOptional, IsArray, IsObject, IsEnum } from 'class-validator';

export enum ProblemSource {
  SYNTHETIC_INTERVIEW = 'SYNTHETIC_INTERVIEW',
  MANUAL = 'MANUAL',
  IMPORT = 'IMPORT',
  RESEARCH = 'RESEARCH',
}

export enum ProblemStatus {
  DISCOVERED = 'DISCOVERED',
  SHORTLISTED = 'SHORTLISTED',
  BACKLOG = 'BACKLOG',
  IN_PROGRESS = 'IN_PROGRESS',
  SOLVED = 'SOLVED',
  DISCARDED = 'DISCARDED',
}

export class CreateProblemDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProblemSource)
  @IsOptional()
  source?: ProblemSource;

  @IsObject()
  @IsOptional()
  evidence?: Record<string, any>; // Who reported, how discovered, etc.

  @IsObject()
  @IsOptional()
  scores?: Record<string, number>; // Severity, feasibility, etc.

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateProblemDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProblemStatus)
  @IsOptional()
  status?: ProblemStatus;

  @IsObject()
  @IsOptional()
  evidence?: Record<string, any>;

  @IsObject()
  @IsOptional()
  scores?: Record<string, number>;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class ImportProblemsDto {
  @IsArray()
  problems: CreateProblemDto[];
}

export class ProblemResponseDto {
  id: string;
  title: string;
  description?: string;
  source: ProblemSource;
  evidence: Record<string, any>;
  scores: Record<string, number>;
  status: ProblemStatus;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
