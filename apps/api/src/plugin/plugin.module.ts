import { Module, forwardRef } from '@nestjs/common';
import { PluginController } from './plugin.controller';
import { PluginService } from './plugin.service';
import { PluginApiKeyGuard } from './guards/plugin-api-key.guard';
import { PrismaService } from '../database/prisma.service';
import { FeaturesModule } from '../features/features.module';

@Module({
  imports: [forwardRef(() => FeaturesModule)],
  controllers: [PluginController],
  providers: [PluginService, PluginApiKeyGuard, PrismaService],
  exports: [PluginService],
})
export class PluginModule {}
