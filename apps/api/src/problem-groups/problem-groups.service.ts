import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateProblemGroupDto,
  UpdateProblemGroupDto,
  AddProblemsToGroupDto,
  BulkGroupOperationDto,
} from './dto/problem-groups.dto';

@Injectable()
export class ProblemGroupsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateProblemGroupDto) {
    return this.prisma.problemGroup.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        color: dto.color,
        icon: dto.icon,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.problemGroup.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { problems: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const group = await this.prisma.problemGroup.findFirst({
      where: { id, tenantId },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Problem group not found');
    }

    return group;
  }

  async update(tenantId: string, id: string, dto: UpdateProblemGroupDto) {
    await this.findOne(tenantId, id);

    return this.prisma.problemGroup.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.icon !== undefined && { icon: dto.icon }),
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.problemGroup.delete({ where: { id } });
  }

  // Add problems to a specific group
  async addProblemsToGroup(
    tenantId: string,
    groupId: string,
    dto: AddProblemsToGroupDto,
    userId?: string,
  ) {
    // Verify group exists
    await this.findOne(tenantId, groupId);

    // Verify all problems exist and belong to tenant
    const problems = await this.prisma.problem.findMany({
      where: {
        id: { in: dto.problemIds },
        tenantId,
      },
    });

    if (problems.length !== dto.problemIds.length) {
      throw new BadRequestException('Some problems not found');
    }

    // Create memberships (skip existing ones)
    const created = await this.prisma.$transaction(
      dto.problemIds.map((problemId) =>
        this.prisma.problemGroupMembership.upsert({
          where: {
            problemId_groupId: { problemId, groupId },
          },
          create: {
            problemId,
            groupId,
            addedBy: userId,
          },
          update: {}, // No update needed if exists
        }),
      ),
    );

    return { added: created.length };
  }

  // Remove problems from a specific group
  async removeProblemsFromGroup(
    tenantId: string,
    groupId: string,
    dto: AddProblemsToGroupDto,
  ) {
    // Verify group exists
    await this.findOne(tenantId, groupId);

    const deleted = await this.prisma.problemGroupMembership.deleteMany({
      where: {
        groupId,
        problemId: { in: dto.problemIds },
      },
    });

    return { removed: deleted.count };
  }

  // Bulk operation: Add multiple problems to multiple groups
  async bulkAddToGroups(
    tenantId: string,
    dto: BulkGroupOperationDto,
    userId?: string,
  ) {
    // Verify all groups exist
    const groups = await this.prisma.problemGroup.findMany({
      where: {
        id: { in: dto.groupIds },
        tenantId,
      },
    });

    if (groups.length !== dto.groupIds.length) {
      throw new BadRequestException('Some groups not found');
    }

    // Verify all problems exist
    const problems = await this.prisma.problem.findMany({
      where: {
        id: { in: dto.problemIds },
        tenantId,
      },
    });

    if (problems.length !== dto.problemIds.length) {
      throw new BadRequestException('Some problems not found');
    }

    // Create all memberships
    const memberships: { problemId: string; groupId: string }[] = [];
    for (const problemId of dto.problemIds) {
      for (const groupId of dto.groupIds) {
        memberships.push({ problemId, groupId });
      }
    }

    // Upsert all memberships in a transaction
    const results = await this.prisma.$transaction(
      memberships.map((m) =>
        this.prisma.problemGroupMembership.upsert({
          where: {
            problemId_groupId: { problemId: m.problemId, groupId: m.groupId },
          },
          create: {
            problemId: m.problemId,
            groupId: m.groupId,
            addedBy: userId,
          },
          update: {},
        }),
      ),
    );

    return {
      added: results.length,
      problemCount: dto.problemIds.length,
      groupCount: dto.groupIds.length,
    };
  }

  // Bulk operation: Remove multiple problems from multiple groups
  async bulkRemoveFromGroups(tenantId: string, dto: BulkGroupOperationDto) {
    const deleted = await this.prisma.problemGroupMembership.deleteMany({
      where: {
        groupId: { in: dto.groupIds },
        problemId: { in: dto.problemIds },
        group: { tenantId },
      },
    });

    return { removed: deleted.count };
  }

  // Get all group memberships for a problem
  async getGroupsForProblem(tenantId: string, problemId: string) {
    const memberships = await this.prisma.problemGroupMembership.findMany({
      where: {
        problemId,
        group: { tenantId },
      },
      include: {
        group: true,
      },
    });

    return memberships.map((m) => m.group);
  }

  // Get all problems in a group
  async getProblemsInGroup(tenantId: string, groupId: string) {
    const memberships = await this.prisma.problemGroupMembership.findMany({
      where: {
        groupId,
        group: { tenantId },
      },
      include: {
        problem: true,
      },
    });

    return memberships.map((m) => m.problem);
  }
}
