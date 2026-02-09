import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateClientContextDto } from './dto/onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async getClientContext(tenantId: string) {
    // Find or create client context for this tenant
    let context = await this.prisma.clientContext.findUnique({
      where: { tenantId },
    });

    if (!context) {
      context = await this.prisma.clientContext.create({
        data: {
          tenantId,
          terminologyGlossary: {},
        },
      });
    }

    return context;
  }

  async updateClientContext(tenantId: string, dto: UpdateClientContextDto) {
    // Upsert the client context
    return this.prisma.clientContext.upsert({
      where: { tenantId },
      create: {
        tenantId,
        ...dto,
        terminologyGlossary: dto.terminologyGlossary || {},
      },
      update: {
        ...dto,
        ...(dto.terminologyGlossary && { terminologyGlossary: dto.terminologyGlossary }),
      },
    });
  }

  // Terminology glossary helpers
  async getTerminology(tenantId: string) {
    const context = await this.getClientContext(tenantId);
    return context.terminologyGlossary as Record<string, string>;
  }

  async updateTerminology(tenantId: string, terminology: Record<string, string>) {
    return this.prisma.clientContext.upsert({
      where: { tenantId },
      create: {
        tenantId,
        terminologyGlossary: terminology,
      },
      update: {
        terminologyGlossary: terminology,
      },
    });
  }

  async addTerm(tenantId: string, term: string, definition: string) {
    const context = await this.getClientContext(tenantId);
    const terminology = context.terminologyGlossary as Record<string, string>;
    terminology[term] = definition;

    return this.prisma.clientContext.update({
      where: { tenantId },
      data: {
        terminologyGlossary: terminology,
      },
    });
  }

  async removeTerm(tenantId: string, term: string) {
    const context = await this.getClientContext(tenantId);
    const terminology = context.terminologyGlossary as Record<string, string>;
    delete terminology[term];

    return this.prisma.clientContext.update({
      where: { tenantId },
      data: {
        terminologyGlossary: terminology,
      },
    });
  }
}
