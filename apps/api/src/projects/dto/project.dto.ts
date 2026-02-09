import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';

export enum ProjectItemStatus {
  BACKLOG = 'BACKLOG',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export class CreateProjectItemDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  problemId?: string;

  @IsOptional()
  @IsEnum(ProjectItemStatus)
  status?: ProjectItemStatus;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsString()
  assignee?: string;
}

export class UpdateProjectItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  problemId?: string;

  @IsOptional()
  @IsEnum(ProjectItemStatus)
  status?: ProjectItemStatus;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsString()
  assignee?: string;
}

export class ReorderItemsDto {
  items: { id: string; status: ProjectItemStatus; priority: number }[];
}
