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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';
import { ProblemsService } from './problems.service';
import {
  CreateProblemDto,
  UpdateProblemDto,
  ImportProblemsDto,
  CsvImportDto,
  CsvPreviewDto,
  ExcelImportDto,
  EnrichProblemDto,
  EnrichBatchDto,
  ImportEnrichedDto,
  CreateCommentDto,
  UpdateCommentDto,
} from './dto/problem.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('problems')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProblemsController {
  constructor(private problemsService: ProblemsService) {}

  @Post()
  @Roles(UserRole.FDE, UserRole.ADMIN)
  async create(@Request() req: any, @Body() dto: CreateProblemDto) {
    return this.problemsService.create(req.user.tenantId, dto);
  }

  @Get()
  async findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.problemsService.findAll(req.user.tenantId, { status, search });
  }

  @Get(':id')
  async findOne(
    @Request() req: any,
    @Param('id') id: string,
    @Query('votingSessionId') votingSessionId?: string,
  ) {
    if (votingSessionId) {
      return this.problemsService.getWithVoteSummary(req.user.tenantId, id, votingSessionId);
    }
    return this.problemsService.findOne(req.user.tenantId, id);
  }

  @Put(':id')
  @Roles(UserRole.FDE, UserRole.ADMIN)
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateProblemDto,
  ) {
    return this.problemsService.update(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.FDE, UserRole.ADMIN)
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.problemsService.remove(req.user.tenantId, id);
  }

  @Post('import')
  @Roles(UserRole.FDE, UserRole.ADMIN)
  async import(@Request() req: any, @Body() dto: ImportProblemsDto) {
    return this.problemsService.import(req.user.tenantId, dto);
  }

  @Post('import/csv/preview')
  @Roles(UserRole.FDE, UserRole.ADMIN)
  async previewCsvImport(@Body() dto: CsvPreviewDto) {
    return this.problemsService.previewCsvImport(dto.csvContent);
  }

  @Post('import/csv')
  @Roles(UserRole.FDE, UserRole.ADMIN)
  async importCsv(@Request() req: any, @Body() dto: CsvImportDto) {
    return this.problemsService.importFromCsv(req.user.tenantId, dto.csvContent, dto.sprintId);
  }

  // ============================================================================
  // EXCEL IMPORT
  // ============================================================================

  @Post('import/excel/preview')
  @Roles(UserRole.FDE, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async previewExcelImport(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.problemsService.previewExcelImport(file.buffer);
  }

  @Post('import/excel')
  @Roles(UserRole.FDE, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ExcelImportDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.problemsService.importFromExcel(req.user.tenantId, file.buffer, dto);
  }

  // ============================================================================
  // ENRICHMENT (Agent Integration)
  // ============================================================================

  @Post('enrich')
  @Roles(UserRole.FDE, UserRole.ADMIN)
  async enrichProblem(@Body() dto: EnrichProblemDto) {
    return this.problemsService.enrichProblem(dto);
  }

  @Post('enrich/batch')
  @Roles(UserRole.FDE, UserRole.ADMIN)
  async enrichBatch(@Body() dto: EnrichBatchDto) {
    return this.problemsService.enrichBatch(dto.problems);
  }

  @Post('import/enriched')
  @Roles(UserRole.FDE, UserRole.ADMIN)
  async importEnriched(@Request() req: any, @Body() dto: ImportEnrichedDto) {
    return this.problemsService.importEnriched(req.user.tenantId, dto.problems, dto.sprintId);
  }

  // ============================================================================
  // COMMENTS
  // ============================================================================

  @Get(':id/comments')
  async getComments(@Request() req: any, @Param('id') id: string) {
    return this.problemsService.getComments(req.user.tenantId, id);
  }

  @Post(':id/comments')
  async addComment(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.problemsService.addComment(req.user.tenantId, id, req.user.id, dto.content);
  }

  @Put(':id/comments/:commentId')
  async updateComment(
    @Request() req: any,
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.problemsService.updateComment(
      req.user.tenantId,
      id,
      commentId,
      req.user.id,
      dto.content,
    );
  }

  @Delete(':id/comments/:commentId')
  async deleteComment(
    @Request() req: any,
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ) {
    return this.problemsService.deleteComment(req.user.tenantId, id, commentId, req.user.id);
  }

  // ============================================================================
  // FAVOURITES
  // ============================================================================

  @Get('favourites')
  async listFavourites(@Request() req: any) {
    return this.problemsService.listFavourites(req.user.tenantId, req.user.id);
  }

  @Get(':id/favourite')
  async getFavouriteStatus(@Request() req: any, @Param('id') id: string) {
    return this.problemsService.getFavouriteStatus(req.user.tenantId, id, req.user.id);
  }

  @Post(':id/favourite')
  async addFavourite(@Request() req: any, @Param('id') id: string) {
    return this.problemsService.addFavourite(req.user.tenantId, id, req.user.id);
  }

  @Delete(':id/favourite')
  async removeFavourite(@Request() req: any, @Param('id') id: string) {
    return this.problemsService.removeFavourite(req.user.tenantId, id, req.user.id);
  }
}
