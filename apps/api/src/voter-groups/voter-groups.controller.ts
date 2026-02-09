import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VoterGroupsService } from './voter-groups.service';
import {
  CreateVoterGroupDto,
  UpdateVoterGroupDto,
  CreateTeamCodeDto,
  UpdateTeamCodeDto,
  RedeemTeamCodeDto,
} from './dto/voter-groups.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ========== ADMIN ROUTES (FDE/Admin) ==========
@Controller('voter-groups')
@UseGuards(JwtAuthGuard)
export class VoterGroupsController {
  constructor(private voterGroupsService: VoterGroupsService) {}

  @Post()
  async createGroup(@Request() req: any, @Body() dto: CreateVoterGroupDto) {
    return this.voterGroupsService.createGroup(req.user.tenantId, dto);
  }

  @Get()
  async listGroups(@Request() req: any) {
    return this.voterGroupsService.listGroups(req.user.tenantId);
  }

  @Get(':id')
  async getGroup(@Request() req: any, @Param('id') id: string) {
    return this.voterGroupsService.getGroup(req.user.tenantId, id);
  }

  @Put(':id')
  async updateGroup(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateVoterGroupDto,
  ) {
    return this.voterGroupsService.updateGroup(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  async deleteGroup(@Request() req: any, @Param('id') id: string) {
    return this.voterGroupsService.deleteGroup(req.user.tenantId, id);
  }

  @Get(':id/members')
  async getGroupMembers(@Request() req: any, @Param('id') id: string) {
    return this.voterGroupsService.getGroupMembers(req.user.tenantId, id);
  }

  // Team Code management within a group
  @Post(':id/codes')
  async createTeamCode(
    @Request() req: any,
    @Param('id') groupId: string,
    @Body() dto: CreateTeamCodeDto,
  ) {
    return this.voterGroupsService.createTeamCode(req.user.tenantId, groupId, dto);
  }
}

// ========== TEAM CODES ADMIN ROUTES ==========
@Controller('team-codes')
@UseGuards(JwtAuthGuard)
export class TeamCodesController {
  constructor(private voterGroupsService: VoterGroupsService) {}

  @Get()
  async listTeamCodes(@Request() req: any) {
    return this.voterGroupsService.listTeamCodes(req.user.tenantId);
  }

  @Put(':id')
  async updateTeamCode(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateTeamCodeDto,
  ) {
    return this.voterGroupsService.updateTeamCode(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  async deleteTeamCode(@Request() req: any, @Param('id') id: string) {
    return this.voterGroupsService.deleteTeamCode(req.user.tenantId, id);
  }
}

// ========== PUBLIC TEAM CODE ROUTES ==========
@Controller('team-codes')
export class PublicTeamCodesController {
  constructor(private voterGroupsService: VoterGroupsService) {}

  // Validate a team code (no auth required)
  @Get(':code/validate')
  async validateTeamCode(@Param('code') code: string) {
    return this.voterGroupsService.validateTeamCode(code);
  }

  // Redeem a team code (auth required)
  @Post(':code/redeem')
  @UseGuards(JwtAuthGuard)
  async redeemTeamCode(@Param('code') code: string, @Request() req: any) {
    return this.voterGroupsService.redeemTeamCode(code, req.user.id);
  }
}
