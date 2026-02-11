import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import {
  CreateFeatureDto,
  UpdateFeatureDto,
  FeatureResponse,
  FeatureTreeNode,
  FeatureStatus,
  BulkImportFeaturesDto,
  BulkImportResult,
} from './dto/feature.dto';

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateFeatureDto): Promise<FeatureResponse> {
    // Check for duplicate featureId within tenant
    const existing = await this.prisma.feature.findUnique({
      where: { tenantId_featureId: { tenantId, featureId: dto.featureId } },
    });

    if (existing) {
      throw new ConflictException(`Feature with ID "${dto.featureId}" already exists`);
    }

    // Validate parentId if provided
    if (dto.parentId) {
      const parent = await this.prisma.feature.findFirst({
        where: { id: dto.parentId, tenantId },
      });
      if (!parent) {
        throw new NotFoundException('Parent feature not found');
      }
    }

    const feature = await this.prisma.feature.create({
      data: {
        tenantId,
        featureId: dto.featureId,
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId,
        status: dto.status || FeatureStatus.ACTIVE,
        codeLocations: (dto.codeLocations || []) as unknown as Prisma.InputJsonValue,
        designFiles: (dto.designFiles || []) as unknown as Prisma.InputJsonValue,
        tags: dto.tags || [],
      },
      include: {
        _count: {
          select: { analyticsEvents: true, children: true },
        },
      },
    });

    return this.mapToResponse(feature);
  }

  async findAll(
    tenantId: string,
    filters?: {
      parentId?: string | null;
      status?: FeatureStatus;
      search?: string;
    },
  ): Promise<FeatureResponse[]> {
    const where: any = { tenantId };

    if (filters?.parentId !== undefined) {
      where.parentId = filters.parentId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { featureId: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const features = await this.prisma.feature.findMany({
      where,
      include: {
        _count: {
          select: { analyticsEvents: true, children: true },
        },
      },
      orderBy: [{ status: 'asc' }, { name: 'asc' }],
    });

    return features.map((f) => this.mapToResponse(f));
  }

  async findOne(tenantId: string, id: string): Promise<FeatureResponse> {
    const feature = await this.prisma.feature.findFirst({
      where: { id, tenantId },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { analyticsEvents: true, children: true },
        },
      },
    });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    return this.mapToResponse(feature);
  }

  async findByFeatureId(tenantId: string, featureId: string): Promise<FeatureResponse> {
    const feature = await this.prisma.feature.findUnique({
      where: { tenantId_featureId: { tenantId, featureId } },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { analyticsEvents: true, children: true },
        },
      },
    });

    if (!feature) {
      throw new NotFoundException(`Feature "${featureId}" not found`);
    }

    return this.mapToResponse(feature);
  }

  async update(tenantId: string, id: string, dto: UpdateFeatureDto): Promise<FeatureResponse> {
    const existing = await this.prisma.feature.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Feature not found');
    }

    // Check for featureId conflict if changing it
    if (dto.featureId && dto.featureId !== existing.featureId) {
      const conflict = await this.prisma.feature.findUnique({
        where: { tenantId_featureId: { tenantId, featureId: dto.featureId } },
      });
      if (conflict) {
        throw new ConflictException(`Feature with ID "${dto.featureId}" already exists`);
      }
    }

    // Validate parentId if changing
    if (dto.parentId && dto.parentId !== existing.parentId) {
      // Prevent circular reference
      if (dto.parentId === id) {
        throw new ConflictException('Feature cannot be its own parent');
      }

      const parent = await this.prisma.feature.findFirst({
        where: { id: dto.parentId, tenantId },
      });
      if (!parent) {
        throw new NotFoundException('Parent feature not found');
      }
    }

    const feature = await this.prisma.feature.update({
      where: { id },
      data: {
        featureId: dto.featureId,
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId,
        status: dto.status,
        codeLocations: dto.codeLocations as unknown as Prisma.InputJsonValue | undefined,
        designFiles: dto.designFiles as unknown as Prisma.InputJsonValue | undefined,
        tags: dto.tags,
      },
      include: {
        _count: {
          select: { analyticsEvents: true, children: true },
        },
      },
    });

    return this.mapToResponse(feature);
  }

  async archive(tenantId: string, id: string): Promise<FeatureResponse> {
    const existing = await this.prisma.feature.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Feature not found');
    }

    const feature = await this.prisma.feature.update({
      where: { id },
      data: { status: FeatureStatus.ARCHIVED },
      include: {
        _count: {
          select: { analyticsEvents: true, children: true },
        },
      },
    });

    return this.mapToResponse(feature);
  }

  async getTree(tenantId: string): Promise<FeatureTreeNode[]> {
    // Get all features for tenant
    const features = await this.prisma.feature.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { analyticsEvents: true, children: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Build tree structure
    const featureMap = new Map<string, FeatureTreeNode>();
    const rootFeatures: FeatureTreeNode[] = [];

    // First pass: create all nodes
    for (const feature of features) {
      featureMap.set(feature.id, {
        ...this.mapToResponse(feature),
        children: [],
      });
    }

    // Second pass: build tree
    for (const feature of features) {
      const node = featureMap.get(feature.id)!;
      if (feature.parentId && featureMap.has(feature.parentId)) {
        featureMap.get(feature.parentId)!.children.push(node);
      } else {
        rootFeatures.push(node);
      }
    }

    return rootFeatures;
  }

  async getEventCount(tenantId: string, featureId: string, days: number = 7): Promise<number> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const feature = await this.prisma.feature.findUnique({
      where: { tenantId_featureId: { tenantId, featureId } },
    });

    if (!feature) {
      return 0;
    }

    return this.prisma.analyticsEvent.count({
      where: {
        featureId: feature.id,
        occurredAt: { gte: since },
      },
    });
  }

  async bulkImport(
    tenantId: string,
    dto: BulkImportFeaturesDto,
  ): Promise<BulkImportResult> {
    const result: BulkImportResult = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    const updateExisting = dto.options?.updateExisting ?? true;

    // Build a map of featureId → database ID for parent references
    const existingFeatures = await this.prisma.feature.findMany({
      where: { tenantId },
      select: { id: true, featureId: true },
    });
    const featureIdToDbId = new Map(existingFeatures.map((f) => [f.featureId, f.id]));

    // Process features in order (parents before children)
    // Sort by parentFeatureId - features without parents first
    const sortedFeatures = [...dto.features].sort((a, b) => {
      if (!a.parentFeatureId && b.parentFeatureId) return -1;
      if (a.parentFeatureId && !b.parentFeatureId) return 1;
      return 0;
    });

    for (const featureDto of sortedFeatures) {
      try {
        // Resolve parentId from parentFeatureId
        let parentId: string | null = null;
        if (featureDto.parentFeatureId) {
          parentId = featureIdToDbId.get(featureDto.parentFeatureId) ?? null;
        }

        // Check if feature exists
        const existing = await this.prisma.feature.findUnique({
          where: { tenantId_featureId: { tenantId, featureId: featureDto.featureId } },
        });

        if (existing) {
          if (updateExisting) {
            // Update existing feature
            await this.prisma.feature.update({
              where: { id: existing.id },
              data: {
                name: featureDto.name,
                description: featureDto.description,
                parentId,
                status: featureDto.status || existing.status,
                codeLocations: (featureDto.codeLocations || []) as unknown as Prisma.InputJsonValue,
                designFiles: (featureDto.designFiles || []) as unknown as Prisma.InputJsonValue,
                tags: featureDto.tags || existing.tags,
              },
            });
            result.updated++;
          } else {
            result.skipped++;
          }
        } else {
          // Create new feature
          const newFeature = await this.prisma.feature.create({
            data: {
              tenantId,
              featureId: featureDto.featureId,
              name: featureDto.name,
              description: featureDto.description,
              parentId,
              status: featureDto.status || FeatureStatus.ACTIVE,
              codeLocations: (featureDto.codeLocations || []) as unknown as Prisma.InputJsonValue,
              designFiles: (featureDto.designFiles || []) as unknown as Prisma.InputJsonValue,
              tags: featureDto.tags || [],
            },
          });
          result.created++;

          // Add to map so child features can reference it
          featureIdToDbId.set(featureDto.featureId, newFeature.id);
        }
      } catch (error) {
        result.errors.push({
          featureId: featureDto.featureId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }

  private mapToResponse(feature: any): FeatureResponse {
    return {
      id: feature.id,
      tenantId: feature.tenantId,
      featureId: feature.featureId,
      name: feature.name,
      description: feature.description,
      status: feature.status as FeatureStatus,
      parentId: feature.parentId,
      codeLocations: feature.codeLocations as any[],
      designFiles: feature.designFiles as any[],
      tags: feature.tags,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
      children: feature.children?.map((c: any) => this.mapToResponse(c)),
      parent: feature.parent ? this.mapToResponse(feature.parent) : undefined,
      _count: feature._count,
    };
  }
}
