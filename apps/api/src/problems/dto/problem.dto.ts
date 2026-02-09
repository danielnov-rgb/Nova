import { IsString, IsOptional, IsArray, IsObject, IsEnum, IsBoolean, IsNumber } from 'class-validator';

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

  @IsString()
  @IsOptional()
  hypothesis?: string;

  @IsEnum(ProblemSource)
  @IsOptional()
  source?: ProblemSource;

  @IsArray()
  @IsOptional()
  evidenceItems?: any[]; // Array of structured evidence items

  @IsObject()
  @IsOptional()
  scores?: Record<string, any>; // ScoreWithMeta objects

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  sprintId?: string;
}

export class UpdateProblemDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  hypothesis?: string;

  @IsEnum(ProblemStatus)
  @IsOptional()
  status?: ProblemStatus;

  @IsArray()
  @IsOptional()
  evidenceItems?: any[];

  @IsObject()
  @IsOptional()
  scores?: Record<string, any>;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isShortlisted?: boolean;

  @IsNumber()
  @IsOptional()
  shortlistOrder?: number;

  @IsString()
  @IsOptional()
  sprintId?: string;
}

export class ImportProblemsDto {
  @IsArray()
  problems: CreateProblemDto[];

  @IsString()
  @IsOptional()
  sprintId?: string; // Optional: assign all imported problems to a sprint
}

export class CsvImportDto {
  @IsString()
  csvContent: string;

  @IsString()
  @IsOptional()
  sprintId?: string;
}

export class CsvPreviewDto {
  @IsString()
  csvContent: string;
}

export interface CsvParseResult {
  valid: boolean;
  rowCount: number;
  errors: { row: number; field: string; message: string }[];
  warnings: { row: number; field: string; message: string }[];
  problems: {
    row: number;
    title: string;
    description?: string;
    tags: string[];
    evidence: Record<string, any>;
    scores: Record<string, number>;
  }[];
}

export class ProblemResponseDto {
  id: string;
  title: string;
  description?: string;
  hypothesis?: string;
  source: ProblemSource;
  evidenceItems: any[];
  evidenceSummary?: string;
  scores: Record<string, any>;
  priorityScore?: number;
  status: ProblemStatus;
  isShortlisted: boolean;
  shortlistOrder?: number;
  tags: string[];
  groupIds?: string[];
  sprintId?: string;
  createdAt: Date;
  updatedAt: Date;
}
