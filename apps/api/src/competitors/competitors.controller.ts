import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompetitorsService } from './competitors.service';
import { CreateCompetitorDto, UpdateCompetitorDto } from './dto/competitor.dto';

@Controller('competitors')
@UseGuards(JwtAuthGuard)
export class CompetitorsController {
  constructor(private readonly competitorsService: CompetitorsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.competitorsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.competitorsService.findOne(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() dto: CreateCompetitorDto, @Request() req: any) {
    return this.competitorsService.create(req.user.tenantId, dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCompetitorDto,
    @Request() req: any,
  ) {
    return this.competitorsService.update(id, req.user.tenantId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.competitorsService.delete(id, req.user.tenantId);
  }
}
