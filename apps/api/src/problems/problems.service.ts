import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as XLSX from 'xlsx';
import {
  CreateProblemDto,
  UpdateProblemDto,
  ImportProblemsDto,
  ProblemSource,
  CsvParseResult,
  ExcelParseResult,
  ExcelImportDto,
  EnrichProblemDto,
  EnrichedProblemDto,
  ScoreWithMeta,
} from './dto/problem.dto';

@Injectable()
export class ProblemsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateProblemDto) {
    return this.prisma.problem.create({
      data: {
        tenantId,
        title: dto.title,
        description: dto.description,
        hypothesis: dto.hypothesis,
        source: dto.source || 'MANUAL',
        evidenceItems: dto.evidenceItems || [],
        scores: dto.scores || {},
        tags: dto.tags || [],
        sprintId: dto.sprintId,
      },
    });
  }

  async findAll(tenantId: string, options?: { status?: string; search?: string }) {
    const where: any = { tenantId };

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.search) {
      where.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.problem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const problem = await this.prisma.problem.findFirst({
      where: { id, tenantId },
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }

  async update(tenantId: string, id: string, dto: UpdateProblemDto) {
    // Verify problem exists and belongs to tenant
    await this.findOne(tenantId, id);

    return this.prisma.problem.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.hypothesis !== undefined && { hypothesis: dto.hypothesis }),
        ...(dto.status && { status: dto.status }),
        ...(dto.evidenceItems && { evidenceItems: dto.evidenceItems }),
        ...(dto.scores && { scores: dto.scores }),
        ...(dto.tags && { tags: dto.tags }),
        ...(dto.isShortlisted !== undefined && { isShortlisted: dto.isShortlisted }),
        ...(dto.shortlistOrder !== undefined && { shortlistOrder: dto.shortlistOrder }),
        ...(dto.sprintId !== undefined && { sprintId: dto.sprintId }),
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.problem.delete({ where: { id } });
  }

  async import(tenantId: string, dto: ImportProblemsDto) {
    const problems = await this.prisma.problem.createMany({
      data: dto.problems.map((p) => ({
        tenantId,
        title: p.title,
        description: p.description,
        hypothesis: p.hypothesis,
        source: p.source || ProblemSource.IMPORT,
        evidenceItems: p.evidenceItems || [],
        scores: p.scores || {},
        tags: p.tags || [],
        sprintId: p.sprintId,
      })),
    });

    return { imported: problems.count };
  }

  // Get problem with vote summary for a voting session
  async getWithVoteSummary(tenantId: string, problemId: string, votingSessionId?: string) {
    const problem = await this.findOne(tenantId, problemId);

    if (votingSessionId) {
      const votes = await this.prisma.vote.findMany({
        where: { problemId, votingSessionId },
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      });

      const totalCredits = votes.reduce((sum, v) => sum + v.creditsAssigned, 0);
      const voterCount = votes.length;

      return {
        ...problem,
        voteSummary: {
          totalCredits,
          voterCount,
          votes: votes.map((v) => ({
            credits: v.creditsAssigned,
            comment: v.comment,
            voter: v.user,
            votedAt: v.createdAt,
          })),
        },
      };
    }

    return problem;
  }

  // CSV Import functionality
  parseCsv(csvContent: string): CsvParseResult {
    const lines = csvContent.trim().split('\n');
    const errors: CsvParseResult['errors'] = [];
    const warnings: CsvParseResult['warnings'] = [];
    const problems: CsvParseResult['problems'] = [];

    if (lines.length < 2) {
      return {
        valid: false,
        rowCount: 0,
        errors: [{ row: 0, field: 'file', message: 'CSV must have a header row and at least one data row' }],
        warnings: [],
        problems: [],
      };
    }

    // Parse header row
    const headers = this.parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
    const titleIndex = headers.indexOf('title');
    const descriptionIndex = headers.indexOf('description');
    const tagsIndex = headers.indexOf('tags');
    const severityIndex = headers.indexOf('severity');
    const feasibilityIndex = headers.indexOf('feasibility');
    const impactIndex = headers.indexOf('impact');
    const evidenceSourcesIndex = headers.indexOf('evidence_sources');
    const evidenceQuotesIndex = headers.indexOf('evidence_quotes');

    if (titleIndex === -1) {
      return {
        valid: false,
        rowCount: 0,
        errors: [{ row: 1, field: 'title', message: 'CSV must have a "title" column' }],
        warnings: [],
        problems: [],
      };
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCsvLine(line);
      const rowNum = i + 1;

      const title = values[titleIndex]?.trim();
      if (!title) {
        errors.push({ row: rowNum, field: 'title', message: 'Title is required' });
        continue;
      }

      const description = descriptionIndex !== -1 ? values[descriptionIndex]?.trim() : undefined;

      // Parse tags (comma-separated within the field)
      const tagsRaw = tagsIndex !== -1 ? values[tagsIndex]?.trim() : '';
      const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

      // Parse scores
      const scores: Record<string, number> = {};
      if (severityIndex !== -1 && values[severityIndex]) {
        const severity = parseInt(values[severityIndex], 10);
        if (!isNaN(severity) && severity >= 1 && severity <= 10) {
          scores.severity = severity;
        } else if (values[severityIndex].trim()) {
          warnings.push({ row: rowNum, field: 'severity', message: 'Severity must be 1-10, skipped' });
        }
      }
      if (feasibilityIndex !== -1 && values[feasibilityIndex]) {
        const feasibility = parseInt(values[feasibilityIndex], 10);
        if (!isNaN(feasibility) && feasibility >= 1 && feasibility <= 10) {
          scores.feasibility = feasibility;
        } else if (values[feasibilityIndex].trim()) {
          warnings.push({ row: rowNum, field: 'feasibility', message: 'Feasibility must be 1-10, skipped' });
        }
      }
      if (impactIndex !== -1 && values[impactIndex]) {
        const impact = parseInt(values[impactIndex], 10);
        if (!isNaN(impact) && impact >= 1 && impact <= 10) {
          scores.impact = impact;
        } else if (values[impactIndex].trim()) {
          warnings.push({ row: rowNum, field: 'impact', message: 'Impact must be 1-10, skipped' });
        }
      }

      // Parse evidence
      const evidence: Record<string, any> = {};
      if (evidenceSourcesIndex !== -1 && values[evidenceSourcesIndex]) {
        evidence.sources = values[evidenceSourcesIndex].split(',').map((s) => s.trim()).filter(Boolean);
      }
      if (evidenceQuotesIndex !== -1 && values[evidenceQuotesIndex]) {
        evidence.quotes = values[evidenceQuotesIndex].split('|').map((q) => q.trim()).filter(Boolean);
      }

      problems.push({
        row: rowNum,
        title,
        description,
        tags,
        evidence,
        scores,
      });
    }

    return {
      valid: errors.length === 0,
      rowCount: problems.length,
      errors,
      warnings,
      problems,
    };
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
    }
    result.push(current);

    return result;
  }

  async previewCsvImport(csvContent: string): Promise<CsvParseResult> {
    return this.parseCsv(csvContent);
  }

  async importFromCsv(tenantId: string, csvContent: string, sprintId?: string) {
    const parseResult = this.parseCsv(csvContent);

    if (!parseResult.valid) {
      throw new BadRequestException({
        message: 'CSV validation failed',
        errors: parseResult.errors,
      });
    }

    if (parseResult.problems.length === 0) {
      throw new BadRequestException('No valid problems found in CSV');
    }

    // Validate sprintId if provided
    if (sprintId) {
      const sprint = await this.prisma.sprint.findFirst({
        where: { id: sprintId, tenantId },
      });
      if (!sprint) {
        throw new BadRequestException('Sprint not found');
      }
    }

    const created = await this.prisma.problem.createMany({
      data: parseResult.problems.map((p) => ({
        tenantId,
        title: p.title,
        description: p.description,
        source: ProblemSource.IMPORT,
        evidenceItems: p.evidence ? [p.evidence] : [],
        scores: p.scores,
        tags: p.tags,
        sprintId: sprintId || null,
      })),
    });

    return {
      imported: created.count,
      warnings: parseResult.warnings,
    };
  }

  // ============================================================================
  // EXCEL IMPORT
  // ============================================================================

  parseExcel(buffer: Buffer): ExcelParseResult {
    const errors: ExcelParseResult['errors'] = [];
    const warnings: ExcelParseResult['warnings'] = [];
    const problems: ExcelParseResult['problems'] = [];

    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        return {
          valid: false,
          rowCount: 0,
          headers: [],
          errors: [{ row: 0, field: 'file', message: 'Excel file has no sheets' }],
          warnings: [],
          problems: [],
        };
      }

      const sheet = workbook.Sheets[sheetName];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (rows.length < 2) {
        return {
          valid: false,
          rowCount: 0,
          headers: [],
          errors: [{ row: 0, field: 'file', message: 'Excel must have a header row and at least one data row' }],
          warnings: [],
          problems: [],
        };
      }

      // Parse header row
      const headers = (rows[0] as string[]).map((h) => String(h || '').toLowerCase().trim());
      const titleIndex = headers.findIndex((h) => h === 'title' || h === 'problem' || h === 'problem title');

      if (titleIndex === -1) {
        return {
          valid: false,
          rowCount: 0,
          headers,
          errors: [{ row: 1, field: 'title', message: 'Excel must have a "title" or "problem" column' }],
          warnings: [],
          problems: [],
        };
      }

      const descriptionIndex = headers.findIndex((h) => h === 'description' || h === 'details');

      // Parse data rows
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.every((cell) => !cell)) continue; // Skip empty rows

        const rowNum = i + 1;
        const title = row[titleIndex] ? String(row[titleIndex]).trim() : '';

        if (!title) {
          errors.push({ row: rowNum, field: 'title', message: 'Title is required' });
          continue;
        }

        const description = descriptionIndex !== -1 && row[descriptionIndex]
          ? String(row[descriptionIndex]).trim()
          : undefined;

        // Capture all columns as raw data for enrichment
        const rawData: Record<string, any> = {};
        headers.forEach((header, idx) => {
          if (header && row[idx] !== undefined && row[idx] !== null) {
            rawData[header] = row[idx];
          }
        });

        problems.push({
          row: rowNum,
          title,
          description,
          rawData,
        });
      }

      return {
        valid: errors.length === 0,
        rowCount: problems.length,
        headers,
        errors,
        warnings,
        problems,
      };
    } catch (error) {
      return {
        valid: false,
        rowCount: 0,
        headers: [],
        errors: [{ row: 0, field: 'file', message: `Failed to parse Excel file: ${error.message}` }],
        warnings: [],
        problems: [],
      };
    }
  }

  async previewExcelImport(buffer: Buffer): Promise<ExcelParseResult> {
    return this.parseExcel(buffer);
  }

  async importFromExcel(
    tenantId: string,
    buffer: Buffer,
    dto: ExcelImportDto,
  ): Promise<{ imported: number; problemIds: string[] }> {
    const parseResult = this.parseExcel(buffer);

    if (!parseResult.valid) {
      throw new BadRequestException({
        message: 'Excel validation failed',
        errors: parseResult.errors,
      });
    }

    if (parseResult.problems.length === 0) {
      throw new BadRequestException('No valid problems found in Excel');
    }

    // Validate sprintId if provided
    if (dto.sprintId) {
      const sprint = await this.prisma.sprint.findFirst({
        where: { id: dto.sprintId, tenantId },
      });
      if (!sprint) {
        throw new BadRequestException('Sprint not found');
      }
    }

    // If enrichment requested, enrich each problem before saving
    let problemsToCreate = parseResult.problems;
    if (dto.enrichWithAgent) {
      const enrichedProblems = await Promise.all(
        parseResult.problems.map((p) =>
          this.enrichProblem({
            title: p.title,
            description: p.description,
            sourceContext: JSON.stringify(p.rawData),
          }),
        ),
      );

      // Create with enriched data
      const created = await Promise.all(
        enrichedProblems.map((enriched) =>
          this.prisma.problem.create({
            data: {
              tenantId,
              title: enriched.title,
              description: enriched.description,
              hypothesis: enriched.hypothesis,
              source: ProblemSource.IMPORT,
              evidenceItems: enriched.evidenceItems as any,
              scores: enriched.scores as any,
              tags: enriched.tags,
              sprintId: dto.sprintId || null,
            },
          }),
        ),
      );

      return {
        imported: created.length,
        problemIds: created.map((p) => p.id),
      };
    }

    // Create without enrichment
    const created = await Promise.all(
      problemsToCreate.map((p) =>
        this.prisma.problem.create({
          data: {
            tenantId,
            title: p.title,
            description: p.description,
            source: ProblemSource.IMPORT,
            evidenceItems: [],
            scores: {},
            tags: [],
            sprintId: dto.sprintId || null,
          },
        }),
      ),
    );

    return {
      imported: created.length,
      problemIds: created.map((p) => p.id),
    };
  }

  // ============================================================================
  // ENRICHMENT (Agent Integration Point)
  // ============================================================================

  /**
   * Enrich a problem with AI-generated scores, evidence, and metadata.
   * This is a PLACEHOLDER - replace with actual agent/Claude API call.
   */
  async enrichProblem(dto: EnrichProblemDto): Promise<EnrichedProblemDto> {
    // PLACEHOLDER: Your agent will replace this logic
    // For now, return structure with default values

    const defaultScore: ScoreWithMeta = {
      value: 50,
      confidence: 0,
      justification: 'Awaiting enrichment - placeholder score',
      source: 'AI',
    };

    return {
      title: dto.title,
      description: dto.description || `Problem: ${dto.title}`,
      hypothesis: `We believe that addressing "${dto.title}" will improve user experience and satisfaction.`,

      scores: {
        applicability: { ...defaultScore },
        severity: { ...defaultScore },
        frequency: { ...defaultScore },
        willingnessToPay: { ...defaultScore },
        retentionImpact: { ...defaultScore },
        acquisitionPotential: { ...defaultScore },
        viralCoefficient: { ...defaultScore },
        strategicFit: { ...defaultScore },
        feasibility: { ...defaultScore },
        timeToValue: { ...defaultScore },
        riskLevel: { ...defaultScore },
      },

      evidenceItems: [],
      tags: [],

      enrichmentMetadata: {
        enrichedAt: new Date().toISOString(),
        agentVersion: 'placeholder-v0',
        overallConfidence: 0,
      },
    };
  }

  async enrichBatch(problems: EnrichProblemDto[]): Promise<EnrichedProblemDto[]> {
    return Promise.all(problems.map((p) => this.enrichProblem(p)));
  }

  /**
   * Import already-enriched problems (from Nova Agent)
   */
  async importEnriched(
    tenantId: string,
    problems: EnrichedProblemDto[],
    sprintId?: string,
  ): Promise<{ imported: number; problemIds: string[] }> {
    // Validate sprintId if provided
    if (sprintId) {
      const sprint = await this.prisma.sprint.findFirst({
        where: { id: sprintId, tenantId },
      });
      if (!sprint) {
        throw new BadRequestException('Sprint not found');
      }
    }

    const created = await Promise.all(
      problems.map((p) =>
        this.prisma.problem.create({
          data: {
            tenantId,
            title: p.title,
            description: p.description,
            hypothesis: p.hypothesis,
            source: ProblemSource.SYNTHETIC_INTERVIEW, // Agent-generated
            evidenceItems: p.evidenceItems as any,
            scores: p.scores as any,
            tags: p.tags,
            sprintId: sprintId || null,
          },
        }),
      ),
    );

    return {
      imported: created.length,
      problemIds: created.map((p) => p.id),
    };
  }
}
