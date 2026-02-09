import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateSprintDto,
  UpdateSprintDto,
  AssignProblemsDto,
} from './dto/sprints.dto';

@Injectable()
export class SprintsService {
  constructor(private prisma: PrismaService) {}

  async createSprint(tenantId: string, dto: CreateSprintDto) {
    // Check for existing sprint with same name
    const existing = await this.prisma.sprint.findUnique({
      where: { tenantId_name: { tenantId, name: dto.name } },
    });

    if (existing) {
      throw new ConflictException(
        `Sprint with name "${dto.name}" already exists`,
      );
    }

    return this.prisma.sprint.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        status: dto.status ?? 'PLANNING',
      },
      include: {
        _count: {
          select: {
            problems: true,
            votingSessions: true,
          },
        },
      },
    });
  }

  async listSprints(tenantId: string) {
    return this.prisma.sprint.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: {
            problems: true,
            votingSessions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSprint(tenantId: string, sprintId: string) {
    const sprint = await this.prisma.sprint.findFirst({
      where: { id: sprintId, tenantId },
      include: {
        problems: {
          select: {
            id: true,
            title: true,
            status: true,
            tags: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        votingSessions: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            problems: true,
            votingSessions: true,
          },
        },
      },
    });

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    return sprint;
  }

  async updateSprint(tenantId: string, sprintId: string, dto: UpdateSprintDto) {
    const sprint = await this.prisma.sprint.findFirst({
      where: { id: sprintId, tenantId },
    });

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    // Check for name conflict if name is being changed
    if (dto.name && dto.name !== sprint.name) {
      const existing = await this.prisma.sprint.findUnique({
        where: { tenantId_name: { tenantId, name: dto.name } },
      });
      if (existing) {
        throw new ConflictException(
          `Sprint with name "${dto.name}" already exists`,
        );
      }
    }

    return this.prisma.sprint.update({
      where: { id: sprintId },
      data: {
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status,
      },
      include: {
        _count: {
          select: {
            problems: true,
            votingSessions: true,
          },
        },
      },
    });
  }

  async deleteSprint(tenantId: string, sprintId: string) {
    const sprint = await this.prisma.sprint.findFirst({
      where: { id: sprintId, tenantId },
    });

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    // Unassign all problems from this sprint first (don't delete them)
    await this.prisma.problem.updateMany({
      where: { sprintId },
      data: { sprintId: null },
    });

    await this.prisma.sprint.delete({
      where: { id: sprintId },
    });

    return { success: true };
  }

  async assignProblems(
    tenantId: string,
    sprintId: string,
    dto: AssignProblemsDto,
  ) {
    const sprint = await this.prisma.sprint.findFirst({
      where: { id: sprintId, tenantId },
    });

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    // Verify all problems belong to the tenant
    const problems = await this.prisma.problem.findMany({
      where: {
        id: { in: dto.problemIds },
        tenantId,
      },
    });

    if (problems.length !== dto.problemIds.length) {
      throw new NotFoundException('Some problems were not found');
    }

    // Assign problems to this sprint
    await this.prisma.problem.updateMany({
      where: {
        id: { in: dto.problemIds },
        tenantId,
      },
      data: { sprintId },
    });

    return this.getSprint(tenantId, sprintId);
  }

  async unassignProblems(
    tenantId: string,
    sprintId: string,
    dto: AssignProblemsDto,
  ) {
    const sprint = await this.prisma.sprint.findFirst({
      where: { id: sprintId, tenantId },
    });

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    // Unassign problems from this sprint
    await this.prisma.problem.updateMany({
      where: {
        id: { in: dto.problemIds },
        sprintId, // Only unassign if they're currently in this sprint
        tenantId,
      },
      data: { sprintId: null },
    });

    return this.getSprint(tenantId, sprintId);
  }

  async getUnassignedProblems(tenantId: string) {
    return this.prisma.problem.findMany({
      where: {
        tenantId,
        sprintId: null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        tags: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
