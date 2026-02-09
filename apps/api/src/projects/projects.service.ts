import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProjectItemDto, UpdateProjectItemDto, ProjectItemStatus } from './dto/project.dto';
import { ProjectItem } from '.prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, status?: ProjectItemStatus) {
    return this.prisma.projectItem.findMany({
      where: {
        tenantId,
        ...(status && { status }),
      },
      orderBy: [{ status: 'asc' }, { priority: 'asc' }],
    });
  }

  async findOne(id: string, tenantId: string) {
    const item = await this.prisma.projectItem.findFirst({
      where: { id, tenantId },
    });

    if (!item) {
      throw new NotFoundException('Project item not found');
    }

    return item;
  }

  async create(tenantId: string, dto: CreateProjectItemDto) {
    return this.prisma.projectItem.create({
      data: {
        tenantId,
        title: dto.title,
        description: dto.description,
        problemId: dto.problemId,
        status: dto.status || 'BACKLOG',
        priority: dto.priority || 0,
        assignee: dto.assignee,
      },
    });
  }

  async update(id: string, tenantId: string, dto: UpdateProjectItemDto) {
    await this.findOne(id, tenantId);

    return this.prisma.projectItem.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.problemId !== undefined && { problemId: dto.problemId }),
        ...(dto.status && { status: dto.status }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.assignee !== undefined && { assignee: dto.assignee }),
      },
    });
  }

  async delete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    await this.prisma.projectItem.delete({
      where: { id },
    });

    return { success: true };
  }

  async reorder(tenantId: string, items: { id: string; status: ProjectItemStatus; priority: number }[]) {
    // Update all items in a transaction
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.projectItem.updateMany({
          where: { id: item.id, tenantId },
          data: { status: item.status, priority: item.priority },
        })
      )
    );

    return { success: true };
  }

  async getByStatus(tenantId: string) {
    const items = await this.prisma.projectItem.findMany({
      where: { tenantId },
      orderBy: { priority: 'asc' },
    });

    return {
      BACKLOG: items.filter((i: ProjectItem) => i.status === 'BACKLOG'),
      IN_PROGRESS: items.filter((i: ProjectItem) => i.status === 'IN_PROGRESS'),
      REVIEW: items.filter((i: ProjectItem) => i.status === 'REVIEW'),
      DONE: items.filter((i: ProjectItem) => i.status === 'DONE'),
    };
  }
}
