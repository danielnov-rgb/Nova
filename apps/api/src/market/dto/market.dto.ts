import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';

export enum MarketIntelligenceCategory {
  INDUSTRY = 'INDUSTRY',
  BENCHMARK = 'BENCHMARK',
  ECONOMIC = 'ECONOMIC',
  PRICING = 'PRICING',
  DEMOGRAPHIC = 'DEMOGRAPHIC',
}

export class CreateMarketIntelligenceDto {
  @IsEnum(MarketIntelligenceCategory)
  category: MarketIntelligenceCategory;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class UpdateMarketIntelligenceDto {
  @IsOptional()
  @IsEnum(MarketIntelligenceCategory)
  category?: MarketIntelligenceCategory;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
