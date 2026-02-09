import { IsString, IsOptional, IsArray, IsObject, IsEnum } from 'class-validator';

export enum SolutionStatus {
  DESIGNED = 'DESIGNED',
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  LIVE = 'LIVE',
  KILLED = 'KILLED',
}

export class CreateSolutionDto {
  @IsString()
  problemId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  mockups?: string[];

  @IsOptional()
  @IsObject()
  assumptions?: Record<string, unknown>;

  @IsOptional()
  @IsEnum(SolutionStatus)
  status?: SolutionStatus;
}

export class UpdateSolutionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  mockups?: string[];

  @IsOptional()
  @IsObject()
  assumptions?: Record<string, unknown>;

  @IsOptional()
  @IsEnum(SolutionStatus)
  status?: SolutionStatus;
}
