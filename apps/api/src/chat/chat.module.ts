import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { OnboardingModule } from '../onboarding/onboarding.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [DatabaseModule, OnboardingModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
