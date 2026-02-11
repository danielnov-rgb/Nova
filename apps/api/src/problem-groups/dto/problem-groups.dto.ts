import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class CreateProblemGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}

export class UpdateProblemGroupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}

export class AddProblemsToGroupDto {
  @IsArray()
  @IsString({ each: true })
  problemIds: string[];
}

export class BulkGroupOperationDto {
  @IsArray()
  @IsString({ each: true })
  problemIds: string[];

  @IsArray()
  @IsString({ each: true })
  groupIds: string[];
}
