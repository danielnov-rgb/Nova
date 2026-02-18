import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DemoModeInterceptor } from './auth/interceptors/demo-mode.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database';
import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module';
import { VotingModule } from './voting/voting.module';
import { VoterGroupsModule } from './voter-groups/voter-groups.module';
import { SprintsModule } from './sprints/sprints.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { AudienceModule } from './audience/audience.module';
import { MarketModule } from './market/market.module';
import { CompetitorsModule } from './competitors/competitors.module';
import { ProjectsModule } from './projects/projects.module';
import { SolutionsModule } from './solutions/solutions.module';
import { FeaturesModule } from './features/features.module';
import { PluginModule } from './plugin/plugin.module';
import { ProblemGroupsModule } from './problem-groups/problem-groups.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    ProblemsModule,
    VotingModule,
    VoterGroupsModule,
    SprintsModule,
    OnboardingModule,
    AudienceModule,
    MarketModule,
    CompetitorsModule,
    ProjectsModule,
    SolutionsModule,
    FeaturesModule,
    PluginModule,
    ProblemGroupsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DemoModeInterceptor,
    },
  ],
})
export class AppModule {}
