import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateClientContextDto {
  @IsOptional()
  @IsString()
  objectives?: string;

  @IsOptional()
  @IsString()
  businessModel?: string;

  @IsOptional()
  @IsString()
  competitiveAdvantages?: string;

  @IsOptional()
  @IsString()
  existingProblems?: string;

  @IsOptional()
  @IsString()
  designSystemUrl?: string;

  @IsOptional()
  @IsString()
  gitRepoUrl?: string;

  @IsOptional()
  @IsObject()
  terminologyGlossary?: Record<string, string>;
}
