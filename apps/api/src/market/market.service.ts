import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMarketIntelligenceDto, UpdateMarketIntelligenceDto } from './dto/market.dto';

@Injectable()
export class MarketService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, category?: string) {
    return this.prisma.marketIntelligence.findMany({
      where: {
        tenantId,
        ...(category && { category: category as any }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const item = await this.prisma.marketIntelligence.findFirst({
      where: { id, tenantId },
    });

    if (!item) {
      throw new NotFoundException('Market intelligence item not found');
    }

    return item;
  }

  async create(tenantId: string, dto: CreateMarketIntelligenceDto) {
    return this.prisma.marketIntelligence.create({
      data: {
        tenantId,
        category: dto.category,
        title: dto.title,
        value: dto.value,
        source: dto.source,
        notes: dto.notes,
        metadata: (dto.metadata || {}) as any,
      },
    });
  }

  async update(id: string, tenantId: string, dto: UpdateMarketIntelligenceDto) {
    await this.findOne(id, tenantId);

    return this.prisma.marketIntelligence.update({
      where: { id },
      data: {
        ...(dto.category && { category: dto.category }),
        ...(dto.title && { title: dto.title }),
        ...(dto.value !== undefined && { value: dto.value }),
        ...(dto.source !== undefined && { source: dto.source }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.metadata && { metadata: dto.metadata as any }),
      },
    });
  }

  async delete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    await this.prisma.marketIntelligence.delete({
      where: { id },
    });

    return { success: true };
  }
}
