import { Module } from '@nestjs/common';
import {
  VoterGroupsController,
  TeamCodesController,
  PublicTeamCodesController,
} from './voter-groups.controller';
import { VoterGroupsService } from './voter-groups.service';

@Module({
  controllers: [VoterGroupsController, TeamCodesController, PublicTeamCodesController],
  providers: [VoterGroupsService],
  exports: [VoterGroupsService],
})
export class VoterGroupsModule {}
