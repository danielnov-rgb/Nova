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
import { SprintsService } from './sprints.service';
import {
  CreateSprintDto,
  UpdateSprintDto,
  AssignProblemsDto,
} from './dto/sprints.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sprints')
@UseGuards(JwtAuthGuard)
export class SprintsController {
  constructor(private sprintsService: SprintsService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateSprintDto) {
    return this.sprintsService.createSprint(req.user.tenantId, dto);
  }

  @Get()
  list(@Request() req: any) {
    return this.sprintsService.listSprints(req.user.tenantId);
  }

  @Get('unassigned-problems')
  getUnassignedProblems(@Request() req: any) {
    return this.sprintsService.getUnassignedProblems(req.user.tenantId);
  }

  @Get(':id')
  get(@Request() req: any, @Param('id') sprintId: string) {
    return this.sprintsService.getSprint(req.user.tenantId, sprintId);
  }

  @Put(':id')
  update(
    @Request() req: any,
    @Param('id') sprintId: string,
    @Body() dto: UpdateSprintDto,
  ) {
    return this.sprintsService.updateSprint(req.user.tenantId, sprintId, dto);
  }

  @Delete(':id')
  delete(@Request() req: any, @Param('id') sprintId: string) {
    return this.sprintsService.deleteSprint(req.user.tenantId, sprintId);
  }

  @Post(':id/problems')
  assignProblems(
    @Request() req: any,
    @Param('id') sprintId: string,
    @Body() dto: AssignProblemsDto,
  ) {
    return this.sprintsService.assignProblems(req.user.tenantId, sprintId, dto);
  }

  @Delete(':id/problems')
  unassignProblems(
    @Request() req: any,
    @Param('id') sprintId: string,
    @Body() dto: AssignProblemsDto,
  ) {
    return this.sprintsService.unassignProblems(req.user.tenantId, sprintId, dto);
  }
}
