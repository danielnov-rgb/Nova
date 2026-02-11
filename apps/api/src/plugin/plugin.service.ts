import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  EventDto,
  UpdatePluginConfigDto,
  PluginConfigResponse,
  IngestEventsResponse,
} from './dto/plugin.dto';

@Injectable()
export class PluginService {
  constructor(private prisma: PrismaService) {}

  // ============================================================================
  // EVENT INGESTION
  // ============================================================================

  async ingestEvents(
    tenantId: string,
    events: EventDto[],
  ): Promise<IngestEventsResponse> {
    const results = {
      accepted: 0,
      rejected: 0,
      errors: [] as string[],
    };

    // Get all valid featureIds for this tenant to validate incoming events
    const validFeatures = await this.prisma.feature.findMany({
      where: { tenantId },
      select: { featureId: true },
    });
    const validFeatureIds = new Set(validFeatures.map((f) => f.featureId));

    // Process events in batch
    const eventsToCreate = [];

    for (const event of events) {
      // Validate featureId if provided
      let featureDbId: string | null = null;
      if (event.featureId) {
        if (!validFeatureIds.has(event.featureId)) {
          // Feature doesn't exist - still accept event but log warning
          results.errors?.push(
            `Unknown featureId: ${event.featureId} - event accepted without feature link`,
          );
        } else {
          // Look up the database ID for the featureId
          const feature = await this.prisma.feature.findUnique({
            where: {
              tenantId_featureId: {
                tenantId,
                featureId: event.featureId,
              },
            },
            select: { id: true },
          });
          featureDbId = feature?.id ?? null;
        }
      }

      eventsToCreate.push({
        tenantId,
        featureId: featureDbId,
        eventType: event.eventType,
        eventName: event.eventName,
        sessionId: event.sessionId,
        deviceId: event.deviceId,
        pageUrl: event.pageUrl,
        referrer: event.referrer,
        userAgent: event.userAgent,
        metadata: event.metadata ?? {},
        occurredAt: event.occurredAt ? new Date(event.occurredAt) : new Date(),
        receivedAt: new Date(),
      });
      results.accepted++;
    }

    // Bulk insert events
    if (eventsToCreate.length > 0) {
      await this.prisma.analyticsEvent.createMany({
        data: eventsToCreate,
      });
    }

    return results;
  }

  // ============================================================================
  // PLUGIN CONFIG MANAGEMENT
  // ============================================================================

  async getConfig(tenantId: string): Promise<PluginConfigResponse> {
    let config = await this.prisma.pluginConfig.findUnique({
      where: { tenantId },
    });

    // Auto-create config if it doesn't exist
    if (!config) {
      config = await this.prisma.pluginConfig.create({
        data: { tenantId },
      });
    }

    return config;
  }

  async updateConfig(
    tenantId: string,
    dto: UpdatePluginConfigDto,
  ): Promise<PluginConfigResponse> {
    // Ensure config exists first
    await this.getConfig(tenantId);

    return this.prisma.pluginConfig.update({
      where: { tenantId },
      data: dto,
    });
  }

  async rotateApiKey(tenantId: string): Promise<{ apiKey: string }> {
    // Ensure config exists first
    await this.getConfig(tenantId);

    // Generate a new API key using cuid
    const config = await this.prisma.pluginConfig.update({
      where: { tenantId },
      data: {
        apiKey: this.generateApiKey(),
      },
    });

    return { apiKey: config.apiKey };
  }

  private generateApiKey(): string {
    // Generate a secure random API key
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const prefix = 'nova_';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + key;
  }

  // ============================================================================
  // ANALYTICS QUERIES
  // ============================================================================

  async getEventStats(
    tenantId: string,
    days: number = 7,
  ): Promise<{
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsByDay: { date: string; count: number }[];
    topFeatures: { featureId: string; name: string; count: number }[];
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total events
    const totalEvents = await this.prisma.analyticsEvent.count({
      where: {
        tenantId,
        occurredAt: { gte: startDate },
      },
    });

    // Events by type
    const eventsByTypeRaw = await this.prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where: {
        tenantId,
        occurredAt: { gte: startDate },
      },
      _count: { id: true },
    });
    const eventsByType: Record<string, number> = {};
    for (const row of eventsByTypeRaw) {
      eventsByType[row.eventType] = row._count.id;
    }

    // Events by day (using raw query for date grouping)
    const eventsByDayRaw = await this.prisma.$queryRaw<
      { date: Date; count: bigint }[]
    >`
      SELECT DATE(occurred_at) as date, COUNT(*) as count
      FROM analytics_events
      WHERE tenant_id = ${tenantId}
        AND occurred_at >= ${startDate}
      GROUP BY DATE(occurred_at)
      ORDER BY date ASC
    `;
    const eventsByDay = eventsByDayRaw.map((row) => ({
      date: row.date.toISOString().split('T')[0],
      count: Number(row.count),
    }));

    // Top features by event count
    const topFeaturesRaw = await this.prisma.analyticsEvent.groupBy({
      by: ['featureId'],
      where: {
        tenantId,
        occurredAt: { gte: startDate },
        featureId: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const featureIds = topFeaturesRaw
      .map((r) => r.featureId)
      .filter((id): id is string => id !== null);

    const features = await this.prisma.feature.findMany({
      where: { id: { in: featureIds } },
      select: { id: true, featureId: true, name: true },
    });

    const featureMap = new Map(features.map((f) => [f.id, f]));
    const topFeatures = topFeaturesRaw
      .filter((r) => r.featureId && featureMap.has(r.featureId))
      .map((r) => {
        const feature = featureMap.get(r.featureId!)!;
        return {
          featureId: feature.featureId,
          name: feature.name,
          count: r._count.id,
        };
      });

    return {
      totalEvents,
      eventsByType,
      eventsByDay,
      topFeatures,
    };
  }
}
