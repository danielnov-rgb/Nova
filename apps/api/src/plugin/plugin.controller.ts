import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { PluginService } from './plugin.service';
import { FeaturesService } from '../features/features.service';
import { PluginApiKeyGuard } from './guards/plugin-api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IngestEventsDto, UpdatePluginConfigDto } from './dto/plugin.dto';
import { BulkImportFeaturesDto } from '../features/dto/feature.dto';

@Controller('plugin')
export class PluginController {
  constructor(
    private pluginService: PluginService,
    private featuresService: FeaturesService,
  ) {}

  // ============================================================================
  // PUBLIC ENDPOINTS (API Key Auth) - Used by Nova Plugin in client apps
  // ============================================================================

  /**
   * Ingest analytics events from client applications
   * Authenticated via x-nova-api-key header
   */
  @Post('events')
  @UseGuards(PluginApiKeyGuard)
  @HttpCode(202)
  async ingestEvents(@Request() req: any, @Body() dto: IngestEventsDto) {
    return this.pluginService.ingestEvents(req.tenantId, dto.events);
  }

  /**
   * Bulk import features from nova-agent CLI
   * Authenticated via x-nova-api-key header
   */
  @Post('features/bulk-import')
  @UseGuards(PluginApiKeyGuard)
  async bulkImportFeatures(@Request() req: any, @Body() dto: BulkImportFeaturesDto) {
    return this.featuresService.bulkImport(req.tenantId, dto);
  }

  // ============================================================================
  // ADMIN ENDPOINTS (JWT Auth) - Used by Nova Admin Dashboard
  // ============================================================================

  /**
   * Get plugin configuration for the tenant
   */
  @Get('config')
  @UseGuards(JwtAuthGuard)
  async getConfig(@Request() req: any) {
    return this.pluginService.getConfig(req.user.tenantId);
  }

  /**
   * Update plugin configuration
   */
  @Put('config')
  @UseGuards(JwtAuthGuard)
  async updateConfig(
    @Request() req: any,
    @Body() dto: UpdatePluginConfigDto,
  ) {
    return this.pluginService.updateConfig(req.user.tenantId, dto);
  }

  /**
   * Rotate API key (generates new key, invalidates old one)
   */
  @Post('config/rotate-key')
  @UseGuards(JwtAuthGuard)
  async rotateApiKey(@Request() req: any) {
    const result = await this.pluginService.rotateApiKey(req.user.tenantId);
    return {
      ...result,
      message: 'API key rotated successfully. Update your plugin configuration with the new key.',
    };
  }

  /**
   * Get analytics statistics
   */
  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getAnalytics(
    @Request() req: any,
    @Query('days') days?: string,
  ) {
    return this.pluginService.getEventStats(
      req.user.tenantId,
      days ? parseInt(days, 10) : 7,
    );
  }
}
