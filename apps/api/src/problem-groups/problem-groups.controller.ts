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
import { ProblemGroupsService } from './problem-groups.service';
import {
  CreateProblemGroupDto,
  UpdateProblemGroupDto,
  AddProblemsToGroupDto,
  BulkGroupOperationDto,
} from './dto/problem-groups.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('problem-groups')
@UseGuards(JwtAuthGuard)
export class ProblemGroupsController {
  constructor(private readonly problemGroupsService: ProblemGroupsService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateProblemGroupDto) {
    return this.problemGroupsService.create(req.user.tenantId, dto);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.problemGroupsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.problemGroupsService.findOne(req.user.tenantId, id);
  }

  @Put(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateProblemGroupDto,
  ) {
    return this.problemGroupsService.update(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.problemGroupsService.remove(req.user.tenantId, id);
  }

  // Add problems to a group
  @Post(':id/problems')
  async addProblems(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AddProblemsToGroupDto,
  ) {
    return this.problemGroupsService.addProblemsToGroup(
      req.user.tenantId,
      id,
      dto,
      req.user.id,
    );
  }

  // Remove problems from a group
  @Delete(':id/problems')
  async removeProblems(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AddProblemsToGroupDto,
  ) {
    return this.problemGroupsService.removeProblemsFromGroup(
      req.user.tenantId,
      id,
      dto,
    );
  }

  // Get all problems in a group
  @Get(':id/problems')
  async getProblems(@Request() req: any, @Param('id') id: string) {
    return this.problemGroupsService.getProblemsInGroup(req.user.tenantId, id);
  }

  // Bulk operations
  @Post('bulk/add')
  async bulkAdd(@Request() req: any, @Body() dto: BulkGroupOperationDto) {
    return this.problemGroupsService.bulkAddToGroups(
      req.user.tenantId,
      dto,
      req.user.id,
    );
  }

  @Post('bulk/remove')
  async bulkRemove(@Request() req: any, @Body() dto: BulkGroupOperationDto) {
    return this.problemGroupsService.bulkRemoveFromGroups(req.user.tenantId, dto);
  }
}
