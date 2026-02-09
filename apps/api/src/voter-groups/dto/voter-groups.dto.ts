import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsDateString } from 'class-validator';

export enum VoterGroupType {
  LEADERSHIP = 'LEADERSHIP',
  PROJECT_TEAM = 'PROJECT_TEAM',
  EXTERNAL_USER = 'EXTERNAL_USER',
}

// ========== Voter Group DTOs ==========

export class CreateVoterGroupDto {
  @IsString()
  name: string;

  @IsEnum(VoterGroupType)
  type: VoterGroupType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  defaultCredits?: number;
}

export class UpdateVoterGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(VoterGroupType)
  type?: VoterGroupType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  defaultCredits?: number;
}

// ========== Team Code DTOs ==========

export class CreateTeamCodeDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  maxUses?: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class UpdateTeamCodeDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  maxUses?: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ValidateTeamCodeDto {
  code: string;
  isValid: boolean;
  group?: {
    id: string;
    name: string;
    type: VoterGroupType;
    defaultCredits: number;
  };
  error?: string;
}

export class RedeemTeamCodeDto {
  @IsString()
  code: string;
}
