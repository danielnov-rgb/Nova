import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateVoterGroupDto,
  UpdateVoterGroupDto,
  CreateTeamCodeDto,
  UpdateTeamCodeDto,
  ValidateTeamCodeDto,
} from './dto/voter-groups.dto';

@Injectable()
export class VoterGroupsService {
  constructor(private prisma: PrismaService) {}

  // ========== Voter Group CRUD ==========

  async createGroup(tenantId: string, dto: CreateVoterGroupDto) {
    // Check for existing group with same name
    const existing = await this.prisma.voterGroup.findUnique({
      where: { tenantId_name: { tenantId, name: dto.name } },
    });

    if (existing) {
      throw new ConflictException(`Voter group with name "${dto.name}" already exists`);
    }

    return this.prisma.voterGroup.create({
      data: {
        tenantId,
        name: dto.name,
        type: dto.type,
        description: dto.description,
        defaultCredits: dto.defaultCredits ?? 10,
      },
      include: {
        _count: {
          select: {
            memberships: true,
            teamCodes: true,
          },
        },
      },
    });
  }

  async listGroups(tenantId: string) {
    return this.prisma.voterGroup.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: {
            memberships: true,
            teamCodes: true,
            sessionGroups: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getGroup(tenantId: string, groupId: string) {
    const group = await this.prisma.voterGroup.findFirst({
      where: { id: groupId, tenantId },
      include: {
        teamCodes: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            memberships: true,
            sessionGroups: true,
            votes: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Voter group not found');
    }

    return group;
  }

  async updateGroup(tenantId: string, groupId: string, dto: UpdateVoterGroupDto) {
    const group = await this.prisma.voterGroup.findFirst({
      where: { id: groupId, tenantId },
    });

    if (!group) {
      throw new NotFoundException('Voter group not found');
    }

    // Check for name conflict if name is being changed
    if (dto.name && dto.name !== group.name) {
      const existing = await this.prisma.voterGroup.findUnique({
        where: { tenantId_name: { tenantId, name: dto.name } },
      });
      if (existing) {
        throw new ConflictException(`Voter group with name "${dto.name}" already exists`);
      }
    }

    return this.prisma.voterGroup.update({
      where: { id: groupId },
      data: {
        name: dto.name,
        type: dto.type,
        description: dto.description,
        defaultCredits: dto.defaultCredits,
      },
      include: {
        _count: {
          select: {
            memberships: true,
            teamCodes: true,
          },
        },
      },
    });
  }

  async deleteGroup(tenantId: string, groupId: string) {
    const group = await this.prisma.voterGroup.findFirst({
      where: { id: groupId, tenantId },
    });

    if (!group) {
      throw new NotFoundException('Voter group not found');
    }

    await this.prisma.voterGroup.delete({
      where: { id: groupId },
    });

    return { success: true };
  }

  async getGroupMembers(tenantId: string, groupId: string) {
    const group = await this.prisma.voterGroup.findFirst({
      where: { id: groupId, tenantId },
    });

    if (!group) {
      throw new NotFoundException('Voter group not found');
    }

    const memberships = await this.prisma.voterGroupMembership.findMany({
      where: { voterGroupId: groupId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return memberships;
  }

  // ========== Team Code CRUD ==========

  async createTeamCode(tenantId: string, groupId: string, dto: CreateTeamCodeDto) {
    // Verify group belongs to tenant
    const group = await this.prisma.voterGroup.findFirst({
      where: { id: groupId, tenantId },
    });

    if (!group) {
      throw new NotFoundException('Voter group not found');
    }

    // Check if code already exists (globally unique)
    const existing = await this.prisma.teamCode.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(`Team code "${dto.code}" already exists`);
    }

    return this.prisma.teamCode.create({
      data: {
        voterGroupId: groupId,
        code: dto.code.toUpperCase(), // Normalize to uppercase
        description: dto.description,
        maxUses: dto.maxUses,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
      include: {
        voterGroup: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        _count: {
          select: {
            redemptions: true,
          },
        },
      },
    });
  }

  async listTeamCodes(tenantId: string) {
    // Get all team codes for groups belonging to this tenant
    const groups = await this.prisma.voterGroup.findMany({
      where: { tenantId },
      select: { id: true },
    });

    const groupIds = groups.map((g) => g.id);

    return this.prisma.teamCode.findMany({
      where: { voterGroupId: { in: groupIds } },
      include: {
        voterGroup: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        _count: {
          select: {
            redemptions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTeamCode(tenantId: string, codeId: string, dto: UpdateTeamCodeDto) {
    // Verify the code belongs to a group in this tenant
    const code = await this.prisma.teamCode.findUnique({
      where: { id: codeId },
      include: { voterGroup: true },
    });

    if (!code || code.voterGroup.tenantId !== tenantId) {
      throw new NotFoundException('Team code not found');
    }

    return this.prisma.teamCode.update({
      where: { id: codeId },
      data: {
        description: dto.description,
        maxUses: dto.maxUses,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        isActive: dto.isActive,
      },
      include: {
        voterGroup: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }

  async deleteTeamCode(tenantId: string, codeId: string) {
    const code = await this.prisma.teamCode.findUnique({
      where: { id: codeId },
      include: { voterGroup: true },
    });

    if (!code || code.voterGroup.tenantId !== tenantId) {
      throw new NotFoundException('Team code not found');
    }

    await this.prisma.teamCode.delete({
      where: { id: codeId },
    });

    return { success: true };
  }

  // ========== Public Team Code Operations ==========

  async validateTeamCode(code: string): Promise<ValidateTeamCodeDto> {
    const teamCode = await this.prisma.teamCode.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        voterGroup: {
          select: {
            id: true,
            name: true,
            type: true,
            defaultCredits: true,
          },
        },
      },
    });

    if (!teamCode) {
      return {
        code,
        isValid: false,
        error: 'Invalid code',
      };
    }

    if (!teamCode.isActive) {
      return {
        code,
        isValid: false,
        error: 'This code has been deactivated',
      };
    }

    if (teamCode.expiresAt && teamCode.expiresAt < new Date()) {
      return {
        code,
        isValid: false,
        error: 'This code has expired',
      };
    }

    if (teamCode.maxUses && teamCode.usesCount >= teamCode.maxUses) {
      return {
        code,
        isValid: false,
        error: 'This code has reached its maximum uses',
      };
    }

    return {
      code,
      isValid: true,
      group: {
        id: teamCode.voterGroup.id,
        name: teamCode.voterGroup.name,
        type: teamCode.voterGroup.type as any,
        defaultCredits: teamCode.voterGroup.defaultCredits,
      },
    };
  }

  async redeemTeamCode(code: string, userId: string) {
    const validation = await this.validateTeamCode(code);

    if (!validation.isValid) {
      throw new BadRequestException(validation.error);
    }

    const teamCode = await this.prisma.teamCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!teamCode) {
      throw new NotFoundException('Team code not found');
    }

    // Check if user already redeemed this code
    const existingRedemption = await this.prisma.teamCodeRedemption.findUnique({
      where: {
        teamCodeId_userId: {
          teamCodeId: teamCode.id,
          userId,
        },
      },
    });

    if (existingRedemption) {
      throw new BadRequestException('You have already used this code');
    }

    // Check if user is already a member of this group
    const existingMembership = await this.prisma.voterGroupMembership.findUnique({
      where: {
        userId_voterGroupId: {
          userId,
          voterGroupId: teamCode.voterGroupId,
        },
      },
    });

    // Create redemption record
    await this.prisma.teamCodeRedemption.create({
      data: {
        teamCodeId: teamCode.id,
        userId,
      },
    });

    // Increment uses count
    await this.prisma.teamCode.update({
      where: { id: teamCode.id },
      data: { usesCount: { increment: 1 } },
    });

    // Create membership if not already a member
    if (!existingMembership) {
      await this.prisma.voterGroupMembership.create({
        data: {
          userId,
          voterGroupId: teamCode.voterGroupId,
          joinedVia: 'TEAM_CODE',
        },
      });
    }

    const group = await this.prisma.voterGroup.findUnique({
      where: { id: teamCode.voterGroupId },
      select: {
        id: true,
        name: true,
        type: true,
        defaultCredits: true,
      },
    });

    return {
      success: true,
      group,
    };
  }
}
