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
import { AudienceService } from './audience.service';
import { CreateAudienceDto, UpdateAudienceDto } from './dto/audience.dto';

@Controller('audience')
@UseGuards(JwtAuthGuard)
export class AudienceController {
  constructor(private readonly audienceService: AudienceService) {}

  @Get()
  async findAll(@Request() req: any, @Query('type') type?: string) {
    if (type) {
      return this.audienceService.getByType(req.user.tenantId, type);
    }
    return this.audienceService.findAll(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.audienceService.findOne(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() dto: CreateAudienceDto, @Request() req: any) {
    return this.audienceService.create(req.user.tenantId, dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAudienceDto,
    @Request() req: any,
  ) {
    return this.audienceService.update(id, req.user.tenantId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.audienceService.delete(id, req.user.tenantId);
  }
}
