import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCompetitorDto, UpdateCompetitorDto } from './dto/competitor.dto';

@Injectable()
export class CompetitorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.competitor.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const competitor = await this.prisma.competitor.findFirst({
      where: { id, tenantId },
    });

    if (!competitor) {
      throw new NotFoundException('Competitor not found');
    }

    return competitor;
  }

  async create(tenantId: string, dto: CreateCompetitorDto) {
    return this.prisma.competitor.create({
      data: {
        tenantId,
        name: dto.name,
        website: dto.website,
        description: dto.description,
        strengths: (dto.strengths || []) as any,
        weaknesses: (dto.weaknesses || []) as any,
        pricing: (dto.pricing || {}) as any,
        solutions: (dto.solutions || []) as any,
        notes: dto.notes,
      },
    });
  }

  async update(id: string, tenantId: string, dto: UpdateCompetitorDto) {
    await this.findOne(id, tenantId);

    return this.prisma.competitor.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.website !== undefined && { website: dto.website }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.strengths && { strengths: dto.strengths as any }),
        ...(dto.weaknesses && { weaknesses: dto.weaknesses as any }),
        ...(dto.pricing && { pricing: dto.pricing as any }),
        ...(dto.solutions && { solutions: dto.solutions as any }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
  }

  async delete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    await this.prisma.competitor.delete({
      where: { id },
    });

    return { success: true };
  }
}
