import { Module } from '@nestjs/common';
import {
  VotingSessionsController,
  VoterController,
  PublicSessionController,
  AuthenticatedVoterController,
} from './voting.controller';
import { VotingService } from './voting.service';

@Module({
  controllers: [
    VotingSessionsController,
    VoterController,
    PublicSessionController,
    AuthenticatedVoterController,
  ],
  providers: [VotingService],
  exports: [VotingService],
})
export class VotingModule {}
