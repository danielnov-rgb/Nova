import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VotingService } from './voting.service';
import {
  CreateVotingSessionDto,
  UpdateVotingSessionDto,
  CreateVotingLinkDto,
  CreateBulkVotingLinksDto,
  CastVoteDto,
  CastBulkVotesDto,
} from './dto/voting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ========== ADMIN ROUTES (FDE/Admin) ==========
@Controller('voting/sessions')
@UseGuards(JwtAuthGuard)
export class VotingSessionsController {
  constructor(private votingService: VotingService) {}

  @Post()
  async createSession(@Request() req: any, @Body() dto: CreateVotingSessionDto) {
    return this.votingService.createSession(req.user.tenantId, dto);
  }

  @Get()
  async listSessions(@Request() req: any) {
    return this.votingService.listSessions(req.user.tenantId);
  }

  @Get(':id')
  async getSession(@Request() req: any, @Param('id') id: string) {
    return this.votingService.getSession(req.user.tenantId, id);
  }

  @Put(':id')
  async updateSession(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateVotingSessionDto,
  ) {
    return this.votingService.updateSession(req.user.tenantId, id, dto);
  }

  @Get(':id/results')
  async getResults(@Request() req: any, @Param('id') id: string) {
    return this.votingService.getResults(req.user.tenantId, id);
  }

  @Get(':id/results/by-group')
  async getResultsByGroup(@Request() req: any, @Param('id') id: string) {
    return this.votingService.getResultsByGroup(req.user.tenantId, id);
  }

  @Get(':id/results/consensus')
  async getConsensusAnalysis(@Request() req: any, @Param('id') id: string) {
    return this.votingService.getConsensusAnalysis(req.user.tenantId, id);
  }

  @Get(':id/participation')
  async getParticipationStats(@Request() req: any, @Param('id') id: string) {
    return this.votingService.getParticipationStats(req.user.tenantId, id);
  }

  @Get(':id/groups')
  async getSessionGroups(@Request() req: any, @Param('id') id: string) {
    return this.votingService.getSessionGroups(req.user.tenantId, id);
  }

  // Voting Links Management
  @Post(':id/links')
  async createLink(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CreateVotingLinkDto,
  ) {
    return this.votingService.createVotingLink(req.user.tenantId, id, dto);
  }

  @Post(':id/links/bulk')
  async createBulkLinks(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CreateBulkVotingLinksDto,
  ) {
    return this.votingService.createBulkVotingLinks(req.user.tenantId, id, dto.links);
  }

  @Get(':id/links')
  async getLinks(@Request() req: any, @Param('id') id: string) {
    return this.votingService.getSessionLinks(req.user.tenantId, id);
  }

  // Voters Management (Admin view of all voters)
  @Get(':id/voters')
  async getVoters(@Request() req: any, @Param('id') id: string) {
    return this.votingService.getSessionVoters(req.user.tenantId, id);
  }

  @Get(':id/voters/:voterId')
  async getVoterDetail(
    @Request() req: any,
    @Param('id') id: string,
    @Param('voterId') voterId: string,
  ) {
    return this.votingService.getVoterDetail(req.user.tenantId, id, voterId);
  }
}

// ========== PUBLIC VOTER ROUTES (via individual link token) ==========
@Controller('vote')
export class VoterController {
  constructor(private votingService: VotingService) {}

  // Get voting session via token (no auth required)
  @Get(':token')
  async getVoterSession(@Param('token') token: string) {
    return this.votingService.getVoterSession(token);
  }

  // Cast a vote via token
  @Post(':token')
  async castVote(@Param('token') token: string, @Body() dto: CastVoteDto) {
    return this.votingService.castVote(token, dto);
  }

  // Cast multiple votes at once
  @Post(':token/bulk')
  async castBulkVotes(@Param('token') token: string, @Body() dto: CastBulkVotesDto) {
    const results = [];
    for (const vote of dto.votes) {
      const result = await this.votingService.castVote(token, vote);
      results.push(result);
    }
    return results;
  }
}

// ========== PUBLIC SESSION ROUTES (public token, no auth for info) ==========
@Controller('vote/session')
export class PublicSessionController {
  constructor(private votingService: VotingService) {}

  // Get public session info by public token (no auth required)
  @Get(':publicToken')
  async getPublicSession(@Param('publicToken') publicToken: string) {
    return this.votingService.getSessionByPublicToken(publicToken);
  }

  // Join a public session (requires auth)
  @Post(':publicToken/join')
  @UseGuards(JwtAuthGuard)
  async joinPublicSession(
    @Param('publicToken') publicToken: string,
    @Request() req: any,
  ) {
    return this.votingService.joinPublicSession(publicToken, req.user.id);
  }
}

// ========== AUTHENTICATED VOTER ROUTES ==========
@Controller('voter/sessions')
@UseGuards(JwtAuthGuard)
export class AuthenticatedVoterController {
  constructor(private votingService: VotingService) {}

  // Get all sessions assigned to the current user
  @Get()
  async getAssignedSessions(@Request() req: any) {
    return this.votingService.getUserAssignedSessions(req.user.id);
  }

  // Get voting interface for a specific session
  @Get(':id')
  async getVoterSession(
    @Param('id') sessionId: string,
    @Request() req: any,
  ) {
    return this.votingService.getVoterSessionForUser(sessionId, req.user.id);
  }

  // Cast a vote as authenticated user
  @Post(':id/vote')
  async castVote(
    @Param('id') sessionId: string,
    @Request() req: any,
    @Body() dto: CastVoteDto,
  ) {
    return this.votingService.castVoteAsUser(sessionId, req.user.id, dto);
  }

  // Cast multiple votes at once
  @Post(':id/votes')
  async castBulkVotes(
    @Param('id') sessionId: string,
    @Request() req: any,
    @Body() dto: CastBulkVotesDto,
  ) {
    const results = [];
    for (const vote of dto.votes) {
      const result = await this.votingService.castVoteAsUser(sessionId, req.user.id, vote);
      results.push(result);
    }
    return results;
  }

  // Mark session as complete for user
  @Post(':id/complete')
  async markComplete(
    @Param('id') sessionId: string,
    @Request() req: any,
  ) {
    return this.votingService.markSessionCompleteForUser(sessionId, req.user.id);
  }
}
