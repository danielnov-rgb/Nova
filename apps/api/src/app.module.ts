import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database';
import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module';
import { VotingModule } from './voting/voting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    ProblemsModule,
    VotingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
