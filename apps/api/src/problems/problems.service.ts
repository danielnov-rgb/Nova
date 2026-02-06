import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateProblemDto,
  UpdateProblemDto,
  ImportProblemsDto,
  ProblemSource,
} from './dto/problem.dto';

@Injectable()
export class ProblemsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateProblemDto) {
    return this.prisma.problem.create({
      data: {
        tenantId,
        title: dto.title,
        description: dto.description,
        source: dto.source || 'MANUAL',
        evidence: dto.evidence || {},
        scores: dto.scores || {},
        tags: dto.tags || [],
      },
    });
  }

  async findAll(tenantId: string, options?: { status?: string; search?: string }) {
    const where: any = { tenantId };

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.search) {
      where.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.problem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const problem = await this.prisma.problem.findFirst({
      where: { id, tenantId },
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }

  async update(tenantId: string, id: string, dto: UpdateProblemDto) {
    // Verify problem exists and belongs to tenant
    await this.findOne(tenantId, id);

    return this.prisma.problem.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status }),
        ...(dto.evidence && { evidence: dto.evidence }),
        ...(dto.scores && { scores: dto.scores }),
        ...(dto.tags && { tags: dto.tags }),
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.problem.delete({ where: { id } });
  }

  async import(tenantId: string, dto: ImportProblemsDto) {
    const problems = await this.prisma.problem.createMany({
      data: dto.problems.map((p) => ({
        tenantId,
        title: p.title,
        description: p.description,
        source: p.source || ProblemSource.IMPORT,
        evidence: p.evidence || {},
        scores: p.scores || {},
        tags: p.tags || [],
      })),
    });

    return { imported: problems.count };
  }

  // Get problem with vote summary for a voting session
  async getWithVoteSummary(tenantId: string, problemId: string, votingSessionId?: string) {
    const problem = await this.findOne(tenantId, problemId);

    if (votingSessionId) {
      const votes = await this.prisma.vote.findMany({
        where: { problemId, votingSessionId },
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      });

      const totalCredits = votes.reduce((sum, v) => sum + v.creditsAssigned, 0);
      const voterCount = votes.length;

      return {
        ...problem,
        voteSummary: {
          totalCredits,
          voterCount,
          votes: votes.map((v) => ({
            credits: v.creditsAssigned,
            comment: v.comment,
            voter: v.user,
            votedAt: v.createdAt,
          })),
        },
      };
    }

    return problem;
  }
}
