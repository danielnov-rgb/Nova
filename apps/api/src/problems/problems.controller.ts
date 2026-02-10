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
} from './dto/problem.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('problems')
@UseGuards(JwtAuthGuard)
export class ProblemsController {
  constructor(private problemsService: ProblemsService) {}

  @Post()
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
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateProblemDto,
  ) {
    return this.problemsService.update(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.problemsService.remove(req.user.tenantId, id);
  }

  @Post('import')
  async import(@Request() req: any, @Body() dto: ImportProblemsDto) {
    return this.problemsService.import(req.user.tenantId, dto);
  }

  @Post('import/csv/preview')
  async previewCsvImport(@Body() dto: CsvPreviewDto) {
    return this.problemsService.previewCsvImport(dto.csvContent);
  }

  @Post('import/csv')
  async importCsv(@Request() req: any, @Body() dto: CsvImportDto) {
    return this.problemsService.importFromCsv(req.user.tenantId, dto.csvContent, dto.sprintId);
  }

  // ============================================================================
  // EXCEL IMPORT
  // ============================================================================

  @Post('import/excel/preview')
  @UseInterceptors(FileInterceptor('file'))
  async previewExcelImport(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.problemsService.previewExcelImport(file.buffer);
  }

  @Post('import/excel')
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
  async enrichProblem(@Body() dto: EnrichProblemDto) {
    return this.problemsService.enrichProblem(dto);
  }

  @Post('enrich/batch')
  async enrichBatch(@Body() dto: EnrichBatchDto) {
    return this.problemsService.enrichBatch(dto.problems);
  }

  @Post('import/enriched')
  async importEnriched(@Request() req: any, @Body() dto: ImportEnrichedDto) {
    return this.problemsService.importEnriched(req.user.tenantId, dto.problems, dto.sprintId);
  }
}
