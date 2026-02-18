import { IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PageContext {
  @IsString()
  agentId: string;

  @IsString()
  currentPage: string;

  @IsOptional()
  @IsObject()
  pageData?: Record<string, unknown>;
}

export class ChatMessageDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @ValidateNested()
  @Type(() => PageContext)
  pageContext: PageContext;
}
