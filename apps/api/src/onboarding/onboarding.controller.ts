import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { UpdateClientContextDto } from './dto/onboarding.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @Get()
  async getClientContext(@Request() req: any) {
    return this.onboardingService.getClientContext(req.user.tenantId);
  }

  @Put()
  async updateClientContext(
    @Request() req: any,
    @Body() dto: UpdateClientContextDto,
  ) {
    return this.onboardingService.updateClientContext(req.user.tenantId, dto);
  }

  // Terminology endpoints
  @Get('terminology')
  async getTerminology(@Request() req: any) {
    return this.onboardingService.getTerminology(req.user.tenantId);
  }

  @Put('terminology')
  async updateTerminology(
    @Request() req: any,
    @Body() terminology: Record<string, string>,
  ) {
    return this.onboardingService.updateTerminology(req.user.tenantId, terminology);
  }

  @Post('terminology/:term')
  async addTerm(
    @Request() req: any,
    @Param('term') term: string,
    @Body('definition') definition: string,
  ) {
    return this.onboardingService.addTerm(req.user.tenantId, term, definition);
  }

  @Delete('terminology/:term')
  async removeTerm(@Request() req: any, @Param('term') term: string) {
    return this.onboardingService.removeTerm(req.user.tenantId, term);
  }
}
