import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MarketService } from './market.service';
import { CreateMarketIntelligenceDto, UpdateMarketIntelligenceDto } from './dto/market.dto';

@Controller('market')
@UseGuards(JwtAuthGuard)
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  async findAll(@Request() req: any, @Query('category') category?: string) {
    return this.marketService.findAll(req.user.tenantId, category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.marketService.findOne(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() dto: CreateMarketIntelligenceDto, @Request() req: any) {
    return this.marketService.create(req.user.tenantId, dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMarketIntelligenceDto,
    @Request() req: any,
  ) {
    return this.marketService.update(id, req.user.tenantId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.marketService.delete(id, req.user.tenantId);
  }
}
