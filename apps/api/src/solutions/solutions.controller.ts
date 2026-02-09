import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SolutionsService } from './solutions.service';
import { CreateSolutionDto, UpdateSolutionDto, SolutionStatus } from './dto/solution.dto';

@Controller('solutions')
@UseGuards(JwtAuthGuard)
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @Get()
  async findAll(@Request() req: any, @Query('status') status?: SolutionStatus) {
    return this.solutionsService.findAll(req.user.tenantId, status);
  }

  @Get('by-problem/:problemId')
  async getByProblem(@Param('problemId') problemId: string, @Request() req: any) {
    return this.solutionsService.getByProblem(problemId, req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.solutionsService.findOne(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() dto: CreateSolutionDto, @Request() req: any) {
    return this.solutionsService.create(req.user.tenantId, dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSolutionDto,
    @Request() req: any,
  ) {
    return this.solutionsService.update(id, req.user.tenantId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.solutionsService.delete(id, req.user.tenantId);
  }
}
