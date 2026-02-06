import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateVotingSessionDto,
  UpdateVotingSessionDto,
  CreateVotingLinkDto,
  CastVoteDto,
} from './dto/voting.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class VotingService {
  constructor(private prisma: PrismaService) {}

  // ========== VOTING SESSIONS ==========

  async createSession(tenantId: string, dto: CreateVotingSessionDto) {
    return this.prisma.$transaction(async (tx) => {
      // Generate public token if session is public
      const publicToken = dto.isPublic
        ? randomBytes(16).toString('hex')
        : null;

      // Create the session
      const session = await tx.votingSession.create({
        data: {
          tenantId,
          title: dto.title,
          description: dto.description,
          deadline: dto.deadline ? new Date(dto.deadline) : null,
          config: dto.config || {},
          status: 'DRAFT',
          isPublic: dto.isPublic || false,
          publicToken,
          defaultCredits: dto.defaultCredits || 10,
        },
      });

      // Link problems to session
      if (dto.problemIds?.length) {
        await tx.votingSessionProblem.createMany({
          data: dto.problemIds.map((problemId, index) => ({
            votingSessionId: session.id,
            problemId,
            displayOrder: index,
          })),
        });
      }

      return this.getSession(tenantId, session.id);
    });
  }

  async getSession(tenantId: string, sessionId: string) {
    const session = await this.prisma.votingSession.findFirst({
      where: { id: sessionId, tenantId },
      include: {
        problems: {
          include: {
            problem: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
        votes: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Voting session not found');
    }

    // Calculate vote summaries per problem
    const problemsWithVotes = session.problems.map((sp) => {
      const problemVotes = session.votes.filter((v) => v.problemId === sp.problemId);
      return {
        id: sp.problem.id,
        title: sp.problem.title,
        description: sp.problem.description,
        preScore: sp.preScore,
        totalCredits: problemVotes.reduce((sum, v) => sum + v.creditsAssigned, 0),
        voterCount: problemVotes.length,
      };
    });

    return {
      id: session.id,
      title: session.title,
      description: session.description,
      deadline: session.deadline,
      status: session.status,
      config: session.config,
      isPublic: session.isPublic,
      publicToken: session.publicToken,
      publicUrl: session.publicToken ? `/vote/join/${session.publicToken}` : null,
      defaultCredits: session.defaultCredits,
      createdAt: session.createdAt,
      problems: problemsWithVotes,
    };
  }

  async listSessions(tenantId: string) {
    const sessions = await this.prisma.votingSession.findMany({
      where: { tenantId },
      include: {
        _count: { select: { problems: true, votes: true, links: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map((s) => ({
      id: s.id,
      title: s.title,
      status: s.status,
      deadline: s.deadline,
      problemCount: s._count.problems,
      voteCount: s._count.votes,
      linkCount: s._count.links,
      createdAt: s.createdAt,
    }));
  }

  async updateSession(tenantId: string, sessionId: string, dto: UpdateVotingSessionDto) {
    const session = await this.prisma.votingSession.findFirst({
      where: { id: sessionId, tenantId },
    });

    if (!session) {
      throw new NotFoundException('Voting session not found');
    }

    // Generate public token if enabling public access
    let publicToken = session.publicToken;
    if (dto.isPublic === true && !publicToken) {
      publicToken = randomBytes(16).toString('hex');
    } else if (dto.isPublic === false) {
      publicToken = null;
    }

    return this.prisma.votingSession.update({
      where: { id: sessionId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.deadline && { deadline: new Date(dto.deadline) }),
        ...(dto.status && { status: dto.status }),
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic, publicToken }),
        ...(dto.defaultCredits && { defaultCredits: dto.defaultCredits }),
      },
    });
  }

  // ========== VOTING LINKS ==========

  async createVotingLink(tenantId: string, sessionId: string, dto: CreateVotingLinkDto) {
    // Verify session exists and belongs to tenant
    const session = await this.prisma.votingSession.findFirst({
      where: { id: sessionId, tenantId },
    });

    if (!session) {
      throw new NotFoundException('Voting session not found');
    }

    const link = await this.prisma.votingLink.create({
      data: {
        votingSessionId: sessionId,
        email: dto.email,
        creditsAllowed: dto.creditsAllowed,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    return {
      ...link,
      votingUrl: `/vote/${link.token}`, // Frontend will handle this route
    };
  }

  async createBulkVotingLinks(
    tenantId: string,
    sessionId: string,
    links: CreateVotingLinkDto[],
  ) {
    const results = await Promise.all(
      links.map((dto) => this.createVotingLink(tenantId, sessionId, dto)),
    );
    return results;
  }

  async getSessionLinks(tenantId: string, sessionId: string) {
    const session = await this.prisma.votingSession.findFirst({
      where: { id: sessionId, tenantId },
    });

    if (!session) {
      throw new NotFoundException('Voting session not found');
    }

    const links = await this.prisma.votingLink.findMany({
      where: { votingSessionId: sessionId },
      orderBy: { createdAt: 'desc' },
    });

    return links.map((link) => ({
      ...link,
      votingUrl: `/vote/${link.token}`,
    }));
  }

  // ========== VOTING (for voters via link) ==========

  async getVoterSession(token: string) {
    const link = await this.prisma.votingLink.findUnique({
      where: { token },
      include: {
        votingSession: {
          include: {
            problems: {
              include: { problem: true },
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!link) {
      throw new NotFoundException('Invalid voting link');
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      throw new ForbiddenException('This voting link has expired');
    }

    if (link.votingSession.status !== 'ACTIVE') {
      throw new ForbiddenException('This voting session is not currently active');
    }

    // Get votes already cast by this link/email
    const existingVotes = await this.prisma.vote.findMany({
      where: {
        votingSessionId: link.votingSessionId,
        user: { email: link.email },
      },
    });

    const creditsUsed = existingVotes.reduce((sum, v) => sum + v.creditsAssigned, 0);

    // Build response with problems and any existing votes
    const problems = link.votingSession.problems.map((sp) => {
      const myVote = existingVotes.find((v) => v.problemId === sp.problemId);
      return {
        id: sp.problem.id,
        title: sp.problem.title,
        description: sp.problem.description,
        evidence: sp.problem.evidence as Record<string, any>,
        scores: sp.problem.scores as Record<string, number>,
        tags: sp.problem.tags,
        myVote: myVote
          ? { credits: myVote.creditsAssigned, comment: myVote.comment }
          : undefined,
      };
    });

    return {
      session: {
        id: link.votingSession.id,
        title: link.votingSession.title,
        description: link.votingSession.description,
        deadline: link.votingSession.deadline,
      },
      voterEmail: link.email,
      creditsAllowed: link.creditsAllowed,
      creditsUsed,
      creditsRemaining: link.creditsAllowed - creditsUsed,
      problems,
    };
  }

  async castVote(token: string, dto: CastVoteDto) {
    const link = await this.prisma.votingLink.findUnique({
      where: { token },
      include: { votingSession: true },
    });

    if (!link) {
      throw new NotFoundException('Invalid voting link');
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      throw new ForbiddenException('This voting link has expired');
    }

    if (link.votingSession.status !== 'ACTIVE') {
      throw new ForbiddenException('This voting session is not currently active');
    }

    // Find or create a voter user for this email
    let voter = await this.prisma.user.findFirst({
      where: { email: link.email, tenantId: link.votingSession.tenantId },
    });

    if (!voter) {
      voter = await this.prisma.user.create({
        data: {
          email: link.email,
          passwordHash: '', // Voter-only accounts don't need passwords
          tenantId: link.votingSession.tenantId,
          role: 'VOTER',
        },
      });
    }

    // Check credits
    const existingVotes = await this.prisma.vote.findMany({
      where: {
        votingSessionId: link.votingSessionId,
        userId: voter.id,
      },
    });

    const creditsUsed = existingVotes.reduce((sum, v) => sum + v.creditsAssigned, 0);
    const existingVoteOnProblem = existingVotes.find((v) => v.problemId === dto.problemId);
    const creditsOnThisProblem = existingVoteOnProblem?.creditsAssigned || 0;

    // Calculate net change in credits
    const netCreditsNeeded = dto.credits - creditsOnThisProblem;
    const creditsRemaining = link.creditsAllowed - creditsUsed;

    if (netCreditsNeeded > creditsRemaining) {
      throw new BadRequestException(
        `Not enough credits. You have ${creditsRemaining} remaining, but need ${netCreditsNeeded} more.`,
      );
    }

    // Mark link as used
    if (!link.usedAt) {
      await this.prisma.votingLink.update({
        where: { id: link.id },
        data: { usedAt: new Date() },
      });
    }

    // Upsert vote
    if (existingVoteOnProblem) {
      return this.prisma.vote.update({
        where: { id: existingVoteOnProblem.id },
        data: {
          creditsAssigned: dto.credits,
          comment: dto.comment,
        },
      });
    } else {
      return this.prisma.vote.create({
        data: {
          votingSessionId: link.votingSessionId,
          problemId: dto.problemId,
          userId: voter.id,
          creditsAssigned: dto.credits,
          comment: dto.comment,
        },
      });
    }
  }

  // ========== RESULTS ==========

  async getResults(tenantId: string, sessionId: string) {
    const session = await this.prisma.votingSession.findFirst({
      where: { id: sessionId, tenantId },
      include: {
        problems: {
          include: { problem: true },
        },
        votes: {
          include: {
            user: { select: { id: true, email: true, firstName: true, lastName: true } },
          },
        },
        links: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Voting session not found');
    }

    // Aggregate results
    const problemResults = session.problems.map((sp) => {
      const votes = session.votes.filter((v) => v.problemId === sp.problemId);
      const totalCredits = votes.reduce((sum, v) => sum + v.creditsAssigned, 0);

      return {
        problem: {
          id: sp.problem.id,
          title: sp.problem.title,
          description: sp.problem.description,
          tags: sp.problem.tags,
        },
        totalCredits,
        voterCount: votes.length,
        votes: votes.map((v) => ({
          credits: v.creditsAssigned,
          comment: v.comment,
          voter: {
            id: v.user.id,
            email: v.user.email,
            name: [v.user.firstName, v.user.lastName].filter(Boolean).join(' ') || v.user.email,
          },
          votedAt: v.createdAt,
        })),
      };
    });

    // Sort by total credits (highest first)
    problemResults.sort((a, b) => b.totalCredits - a.totalCredits);

    const linkStats = {
      total: session.links.length,
      used: session.links.filter((l) => l.usedAt).length,
      unused: session.links.filter((l) => !l.usedAt).length,
    };

    return {
      session: {
        id: session.id,
        title: session.title,
        status: session.status,
        deadline: session.deadline,
      },
      linkStats,
      totalVotes: session.votes.length,
      totalCreditsUsed: session.votes.reduce((sum, v) => sum + v.creditsAssigned, 0),
      results: problemResults,
    };
  }

  // ========== PUBLIC SESSION ACCESS (for registered voters) ==========

  async getSessionByPublicToken(publicToken: string) {
    const session = await this.prisma.votingSession.findUnique({
      where: { publicToken },
      include: {
        tenant: { select: { name: true } },
        _count: { select: { problems: true } },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (!session.isPublic) {
      throw new ForbiddenException('This session is not publicly accessible');
    }

    return {
      id: session.id,
      title: session.title,
      description: session.description,
      deadline: session.deadline,
      status: session.status,
      tenantName: session.tenant.name,
      problemCount: session._count.problems,
      defaultCredits: session.defaultCredits,
    };
  }

  async joinPublicSession(publicToken: string, userId: string) {
    const session = await this.prisma.votingSession.findUnique({
      where: { publicToken },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (!session.isPublic) {
      throw new ForbiddenException('This session is not publicly accessible');
    }

    if (session.status !== 'ACTIVE') {
      throw new ForbiddenException('This session is not currently accepting voters');
    }

    // Check if already joined
    const existing = await this.prisma.voterSession.findUnique({
      where: {
        votingSessionId_userId: {
          votingSessionId: session.id,
          userId,
        },
      },
    });

    if (existing) {
      // Update openedAt if not set
      if (!existing.openedAt) {
        await this.prisma.voterSession.update({
          where: { id: existing.id },
          data: { openedAt: new Date() },
        });
      }
      return { sessionId: session.id, alreadyJoined: true };
    }

    // Create voter session assignment
    await this.prisma.voterSession.create({
      data: {
        votingSessionId: session.id,
        userId,
        creditsAllowed: session.defaultCredits,
        openedAt: new Date(),
      },
    });

    return { sessionId: session.id, alreadyJoined: false };
  }

  async getVoterSessionForUser(sessionId: string, userId: string) {
    const voterSession = await this.prisma.voterSession.findUnique({
      where: {
        votingSessionId_userId: { votingSessionId: sessionId, userId },
      },
      include: {
        votingSession: {
          include: {
            problems: {
              include: { problem: true },
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
        user: { select: { email: true, firstName: true, lastName: true } },
      },
    });

    if (!voterSession) {
      throw new NotFoundException('You are not assigned to this session');
    }

    if (voterSession.votingSession.status !== 'ACTIVE') {
      throw new ForbiddenException('This voting session is not currently active');
    }

    // Get votes already cast by this user
    const existingVotes = await this.prisma.vote.findMany({
      where: { votingSessionId: sessionId, userId },
    });

    const creditsUsed = existingVotes.reduce((sum, v) => sum + v.creditsAssigned, 0);

    // Build response with problems and any existing votes
    const problems = voterSession.votingSession.problems.map((sp) => {
      const myVote = existingVotes.find((v) => v.problemId === sp.problemId);
      return {
        id: sp.problem.id,
        title: sp.problem.title,
        description: sp.problem.description,
        evidence: sp.problem.evidence as Record<string, any>,
        scores: sp.problem.scores as Record<string, number>,
        tags: sp.problem.tags,
        myVote: myVote
          ? { credits: myVote.creditsAssigned, comment: myVote.comment }
          : undefined,
      };
    });

    return {
      session: {
        id: voterSession.votingSession.id,
        title: voterSession.votingSession.title,
        description: voterSession.votingSession.description,
        deadline: voterSession.votingSession.deadline,
        status: voterSession.votingSession.status,
      },
      voter: {
        email: voterSession.user.email,
        name: [voterSession.user.firstName, voterSession.user.lastName]
          .filter(Boolean)
          .join(' ') || voterSession.user.email,
      },
      creditsAllowed: voterSession.creditsAllowed,
      creditsUsed,
      creditsRemaining: voterSession.creditsAllowed - creditsUsed,
      openedAt: voterSession.openedAt,
      completedAt: voterSession.completedAt,
      problems,
    };
  }

  async castVoteAsUser(sessionId: string, userId: string, dto: CastVoteDto) {
    const voterSession = await this.prisma.voterSession.findUnique({
      where: {
        votingSessionId_userId: { votingSessionId: sessionId, userId },
      },
      include: { votingSession: true },
    });

    if (!voterSession) {
      throw new NotFoundException('You are not assigned to this session');
    }

    if (voterSession.votingSession.status !== 'ACTIVE') {
      throw new ForbiddenException('This voting session is not currently active');
    }

    if (voterSession.completedAt) {
      throw new ForbiddenException('You have already completed voting for this session');
    }

    // Check credits
    const existingVotes = await this.prisma.vote.findMany({
      where: { votingSessionId: sessionId, userId },
    });

    const creditsUsed = existingVotes.reduce((sum, v) => sum + v.creditsAssigned, 0);
    const existingVoteOnProblem = existingVotes.find((v) => v.problemId === dto.problemId);
    const creditsOnThisProblem = existingVoteOnProblem?.creditsAssigned || 0;

    const netCreditsNeeded = dto.credits - creditsOnThisProblem;
    const creditsRemaining = voterSession.creditsAllowed - creditsUsed;

    if (netCreditsNeeded > creditsRemaining) {
      throw new BadRequestException(
        `Not enough credits. You have ${creditsRemaining} remaining, but need ${netCreditsNeeded} more.`,
      );
    }

    // Update openedAt if not set
    if (!voterSession.openedAt) {
      await this.prisma.voterSession.update({
        where: { id: voterSession.id },
        data: { openedAt: new Date() },
      });
    }

    // Upsert vote
    if (existingVoteOnProblem) {
      return this.prisma.vote.update({
        where: { id: existingVoteOnProblem.id },
        data: {
          creditsAssigned: dto.credits,
          comment: dto.comment,
        },
      });
    } else {
      return this.prisma.vote.create({
        data: {
          votingSessionId: sessionId,
          problemId: dto.problemId,
          userId,
          creditsAssigned: dto.credits,
          comment: dto.comment,
        },
      });
    }
  }

  async markSessionCompleteForUser(sessionId: string, userId: string) {
    const voterSession = await this.prisma.voterSession.findUnique({
      where: {
        votingSessionId_userId: { votingSessionId: sessionId, userId },
      },
    });

    if (!voterSession) {
      throw new NotFoundException('You are not assigned to this session');
    }

    return this.prisma.voterSession.update({
      where: { id: voterSession.id },
      data: { completedAt: new Date() },
    });
  }

  async getUserAssignedSessions(userId: string) {
    const voterSessions = await this.prisma.voterSession.findMany({
      where: { userId },
      include: {
        votingSession: {
          include: {
            tenant: { select: { name: true } },
            _count: { select: { problems: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get vote counts for each session
    const sessionIds = voterSessions.map((vs) => vs.votingSessionId);
    const voteCounts = await this.prisma.vote.groupBy({
      by: ['votingSessionId'],
      where: { userId, votingSessionId: { in: sessionIds } },
      _sum: { creditsAssigned: true },
    });

    const voteCountMap = new Map(
      voteCounts.map((vc) => [vc.votingSessionId, vc._sum.creditsAssigned || 0]),
    );

    return voterSessions.map((vs) => ({
      id: vs.id,
      sessionId: vs.votingSession.id,
      title: vs.votingSession.title,
      description: vs.votingSession.description,
      tenantName: vs.votingSession.tenant.name,
      status: vs.votingSession.status,
      deadline: vs.votingSession.deadline,
      problemCount: vs.votingSession._count.problems,
      creditsAllowed: vs.creditsAllowed,
      creditsUsed: voteCountMap.get(vs.votingSessionId) || 0,
      openedAt: vs.openedAt,
      completedAt: vs.completedAt,
      assignedAt: vs.createdAt,
    }));
  }

  // ========== ADMIN: SESSION VOTERS ==========

  async getSessionVoters(tenantId: string, sessionId: string) {
    // Verify session exists and belongs to tenant
    const session = await this.prisma.votingSession.findFirst({
      where: { id: sessionId, tenantId },
    });

    if (!session) {
      throw new NotFoundException('Voting session not found');
    }

    // Get all voter sessions (users who joined via public link)
    const voterSessions = await this.prisma.voterSession.findMany({
      where: { votingSessionId: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get all voting links (traditional invite links)
    const votingLinks = await this.prisma.votingLink.findMany({
      where: { votingSessionId: sessionId },
      orderBy: { createdAt: 'desc' },
    });

    // Get vote counts per user
    const userIds = voterSessions.map((vs) => vs.userId);
    const linkEmails = votingLinks.map((l) => l.email);

    const votes = await this.prisma.vote.findMany({
      where: { votingSessionId: sessionId },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    // Build vote summary per user
    const votesByUser = new Map<string, { count: number; credits: number }>();
    votes.forEach((v) => {
      const existing = votesByUser.get(v.userId) || { count: 0, credits: 0 };
      votesByUser.set(v.userId, {
        count: existing.count + 1,
        credits: existing.credits + v.creditsAssigned,
      });
    });

    // Map voter sessions (public link users)
    const publicVoters = voterSessions.map((vs) => {
      const voteSummary = votesByUser.get(vs.userId) || { count: 0, credits: 0 };
      return {
        id: vs.id,
        type: 'public' as const,
        email: vs.user.email,
        name: [vs.user.firstName, vs.user.lastName].filter(Boolean).join(' ') || null,
        userId: vs.userId,
        creditsAllowed: vs.creditsAllowed,
        creditsUsed: voteSummary.credits,
        voteCount: voteSummary.count,
        openedAt: vs.openedAt,
        completedAt: vs.completedAt,
        createdAt: vs.createdAt,
      };
    });

    // Map voting links (invite link users)
    const linkVoters = votingLinks.map((link) => {
      // Find if there's a user with this email who voted
      const userVotes = votes.filter((v) => v.user.email === link.email);
      const userId = userVotes[0]?.userId;
      const voteSummary = userId ? votesByUser.get(userId) : null;

      return {
        id: link.id,
        type: 'link' as const,
        email: link.email,
        name: null,
        userId: userId || null,
        creditsAllowed: link.creditsAllowed,
        creditsUsed: voteSummary?.credits || 0,
        voteCount: voteSummary?.count || 0,
        openedAt: link.usedAt,
        completedAt: null, // Links don't track completion
        createdAt: link.createdAt,
        token: link.token,
        expiresAt: link.expiresAt,
      };
    });

    return {
      session: {
        id: session.id,
        title: session.title,
        status: session.status,
        isPublic: session.isPublic,
      },
      summary: {
        totalVoters: publicVoters.length + linkVoters.length,
        publicVoters: publicVoters.length,
        linkVoters: linkVoters.length,
        completedCount: publicVoters.filter((v) => v.completedAt).length,
        openedCount: publicVoters.filter((v) => v.openedAt).length + linkVoters.filter((v) => v.openedAt).length,
      },
      voters: [...publicVoters, ...linkVoters],
    };
  }

  async getVoterDetail(tenantId: string, sessionId: string, voterId: string) {
    // Verify session exists and belongs to tenant
    const session = await this.prisma.votingSession.findFirst({
      where: { id: sessionId, tenantId },
      include: {
        problems: {
          include: { problem: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Voting session not found');
    }

    // Try to find as VoterSession first
    const voterSession = await this.prisma.voterSession.findUnique({
      where: { id: voterId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    let userId: string | null = null;
    let voterInfo: {
      id: string;
      type: 'public' | 'link';
      email: string;
      name: string | null;
      creditsAllowed: number;
      openedAt: Date | null;
      completedAt: Date | null;
      createdAt: Date;
    };

    if (voterSession) {
      userId = voterSession.userId;
      voterInfo = {
        id: voterSession.id,
        type: 'public',
        email: voterSession.user.email,
        name: [voterSession.user.firstName, voterSession.user.lastName].filter(Boolean).join(' ') || null,
        creditsAllowed: voterSession.creditsAllowed,
        openedAt: voterSession.openedAt,
        completedAt: voterSession.completedAt,
        createdAt: voterSession.createdAt,
      };
    } else {
      // Try to find as VotingLink
      const votingLink = await this.prisma.votingLink.findUnique({
        where: { id: voterId },
      });

      if (!votingLink) {
        throw new NotFoundException('Voter not found');
      }

      // Find user by email if they voted
      const user = await this.prisma.user.findFirst({
        where: { email: votingLink.email },
      });

      userId = user?.id || null;
      voterInfo = {
        id: votingLink.id,
        type: 'link',
        email: votingLink.email,
        name: null,
        creditsAllowed: votingLink.creditsAllowed,
        openedAt: votingLink.usedAt,
        completedAt: null,
        createdAt: votingLink.createdAt,
      };
    }

    // Get votes for this user
    const votes = userId
      ? await this.prisma.vote.findMany({
          where: {
            votingSessionId: sessionId,
            userId,
          },
          orderBy: { createdAt: 'desc' },
        })
      : [];

    // Map votes to problems
    const votesByProblem = new Map(votes.map((v) => [v.problemId, v]));

    const problemsWithVotes = session.problems.map((sp) => {
      const vote = votesByProblem.get(sp.problemId);
      return {
        id: sp.problem.id,
        title: sp.problem.title,
        description: sp.problem.description,
        vote: vote
          ? {
              credits: vote.creditsAssigned,
              comment: vote.comment,
              votedAt: vote.createdAt,
            }
          : null,
      };
    });

    const totalCreditsUsed = votes.reduce((sum, v) => sum + v.creditsAssigned, 0);

    return {
      voter: voterInfo,
      session: {
        id: session.id,
        title: session.title,
        status: session.status,
      },
      summary: {
        creditsAllowed: voterInfo.creditsAllowed,
        creditsUsed: totalCreditsUsed,
        creditsRemaining: voterInfo.creditsAllowed - totalCreditsUsed,
        voteCount: votes.length,
        problemCount: session.problems.length,
      },
      problems: problemsWithVotes,
    };
  }
}
