import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAudienceDto, UpdateAudienceDto } from './dto/audience.dto';

@Injectable()
export class AudienceService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.targetAudience.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const audience = await this.prisma.targetAudience.findFirst({
      where: { id, tenantId },
    });

    if (!audience) {
      throw new NotFoundException('Target audience not found');
    }

    return audience;
  }

  async create(tenantId: string, dto: CreateAudienceDto) {
    return this.prisma.targetAudience.create({
      data: {
        tenantId,
        name: dto.name,
        type: dto.type,
        segments: (dto.segments || []) as any,
        targets: (dto.targets || {}) as any,
      },
    });
  }

  async update(id: string, tenantId: string, dto: UpdateAudienceDto) {
    // Verify it exists first
    await this.findOne(id, tenantId);

    return this.prisma.targetAudience.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.type && { type: dto.type }),
        ...(dto.segments && { segments: dto.segments as any }),
        ...(dto.targets && { targets: dto.targets as any }),
      },
    });
  }

  async delete(id: string, tenantId: string) {
    // Verify it exists first
    await this.findOne(id, tenantId);

    await this.prisma.targetAudience.delete({
      where: { id },
    });

    return { success: true };
  }

  async getByType(tenantId: string, type: string) {
    return this.prisma.targetAudience.findMany({
      where: { tenantId, type: type as any },
      orderBy: { createdAt: 'desc' },
    });
  }
}
