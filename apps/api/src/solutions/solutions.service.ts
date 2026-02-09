import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSolutionDto, UpdateSolutionDto, SolutionStatus } from './dto/solution.dto';

@Injectable()
export class SolutionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, status?: SolutionStatus) {
    return this.prisma.solution.findMany({
      where: {
        tenantId,
        ...(status && { status }),
      },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const solution = await this.prisma.solution.findFirst({
      where: { id, tenantId },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!solution) {
      throw new NotFoundException('Solution not found');
    }

    return solution;
  }

  async create(tenantId: string, dto: CreateSolutionDto) {
    return this.prisma.solution.create({
      data: {
        tenantId,
        problemId: dto.problemId,
        title: dto.title,
        description: dto.description,
        mockups: (dto.mockups || []) as any,
        assumptions: (dto.assumptions || {}) as any,
        status: dto.status || 'DESIGNED',
      },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async update(id: string, tenantId: string, dto: UpdateSolutionDto) {
    await this.findOne(id, tenantId);

    return this.prisma.solution.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.mockups && { mockups: dto.mockups as any }),
        ...(dto.assumptions && { assumptions: dto.assumptions as any }),
        ...(dto.status && { status: dto.status }),
      },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async delete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    await this.prisma.solution.delete({
      where: { id },
    });

    return { success: true };
  }

  async getByProblem(problemId: string, tenantId: string) {
    return this.prisma.solution.findMany({
      where: { problemId, tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
