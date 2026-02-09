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
import { ProjectsService } from './projects.service';
import { CreateProjectItemDto, UpdateProjectItemDto, ReorderItemsDto, ProjectItemStatus } from './dto/project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Request() req: any, @Query('status') status?: ProjectItemStatus) {
    return this.projectsService.findAll(req.user.tenantId, status);
  }

  @Get('by-status')
  async getByStatus(@Request() req: any) {
    return this.projectsService.getByStatus(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.findOne(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() dto: CreateProjectItemDto, @Request() req: any) {
    return this.projectsService.create(req.user.tenantId, dto);
  }

  @Put('reorder')
  async reorder(@Body() dto: ReorderItemsDto, @Request() req: any) {
    return this.projectsService.reorder(req.user.tenantId, dto.items);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectItemDto,
    @Request() req: any,
  ) {
    return this.projectsService.update(id, req.user.tenantId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.delete(id, req.user.tenantId);
  }
}
