import { Module } from '@nestjs/common';
import { ProblemGroupsController } from './problem-groups.controller';
import { ProblemGroupsService } from './problem-groups.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ProblemGroupsController],
  providers: [ProblemGroupsService, PrismaService],
  exports: [ProblemGroupsService],
})
export class ProblemGroupsModule {}
