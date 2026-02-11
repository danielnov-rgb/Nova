import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PluginApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-nova-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('Missing x-nova-api-key header');
    }

    const pluginConfig = await this.prisma.pluginConfig.findUnique({
      where: { apiKey },
      include: { tenant: true },
    });

    if (!pluginConfig) {
      throw new UnauthorizedException('Invalid API key');
    }

    if (!pluginConfig.isEnabled) {
      throw new UnauthorizedException('Plugin is disabled for this tenant');
    }

    // Validate CORS origin if allowedOrigins is configured
    const origin = request.headers.origin;
    if (pluginConfig.allowedOrigins.length > 0 && origin) {
      const isAllowed = pluginConfig.allowedOrigins.some(
        (allowed) => origin === allowed || origin.endsWith(allowed),
      );
      if (!isAllowed) {
        throw new UnauthorizedException('Origin not allowed');
      }
    }

    // Attach tenant info to request for use in controller/service
    request.pluginConfig = pluginConfig;
    request.tenantId = pluginConfig.tenantId;

    return true;
  }
}
