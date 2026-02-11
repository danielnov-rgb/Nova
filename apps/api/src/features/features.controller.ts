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
import { FeaturesService } from './features.service';
import { CreateFeatureDto, UpdateFeatureDto, FeatureStatus, BulkImportFeaturesDto } from './dto/feature.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('features')
@UseGuards(JwtAuthGuard)
export class FeaturesController {
  constructor(private featuresService: FeaturesService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateFeatureDto) {
    return this.featuresService.create(req.user.tenantId, dto);
  }

  @Post('bulk-import')
  async bulkImport(@Request() req: any, @Body() dto: BulkImportFeaturesDto) {
    return this.featuresService.bulkImport(req.user.tenantId, dto);
  }

  @Get()
  async findAll(
    @Request() req: any,
    @Query('parentId') parentId?: string,
    @Query('status') status?: FeatureStatus,
    @Query('search') search?: string,
    @Query('rootOnly') rootOnly?: string,
  ) {
    const filters: any = {};

    if (rootOnly === 'true') {
      filters.parentId = null;
    } else if (parentId) {
      filters.parentId = parentId;
    }

    if (status) {
      filters.status = status;
    }

    if (search) {
      filters.search = search;
    }

    return this.featuresService.findAll(req.user.tenantId, filters);
  }

  @Get('tree')
  async getTree(@Request() req: any) {
    return this.featuresService.getTree(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.featuresService.findOne(req.user.tenantId, id);
  }

  @Get('by-feature-id/:featureId')
  async findByFeatureId(@Request() req: any, @Param('featureId') featureId: string) {
    return this.featuresService.findByFeatureId(req.user.tenantId, featureId);
  }

  @Put(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateFeatureDto,
  ) {
    return this.featuresService.update(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  async archive(@Request() req: any, @Param('id') id: string) {
    return this.featuresService.archive(req.user.tenantId, id);
  }

  @Get(':id/events/count')
  async getEventCount(
    @Request() req: any,
    @Param('id') id: string,
    @Query('days') days?: string,
  ) {
    const feature = await this.featuresService.findOne(req.user.tenantId, id);
    const count = await this.featuresService.getEventCount(
      req.user.tenantId,
      feature.featureId,
      days ? parseInt(days, 10) : 7,
    );
    return { featureId: feature.featureId, eventCount: count, days: days ? parseInt(days, 10) : 7 };
  }
}
