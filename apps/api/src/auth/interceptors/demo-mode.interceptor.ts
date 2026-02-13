import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * DemoModeInterceptor blocks mutating operations for users with isDemoMode=true.
 *
 * Demo users can:
 * - View all data (GET requests)
 * - Vote in sessions
 * - Add comments and favorites
 *
 * Demo users cannot:
 * - Create, update, or delete problems
 * - Create, update, or delete sessions
 * - Modify any other persistent data
 */
@Injectable()
export class DemoModeInterceptor implements NestInterceptor {
  private readonly mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  // Routes that are allowed even in demo mode
  private readonly allowedRoutePatterns = [
    // Voting is always allowed
    /^\/api\/voter\/sessions\/[^/]+\/vote$/,   // single vote
    /^\/api\/voter\/sessions\/[^/]+\/votes$/,  // bulk votes
    /^\/api\/voter\/sessions\/[^/]+\/complete$/,
    /^\/api\/vote\/[^/]+$/,
    // Comments are allowed
    /^\/api\/problems\/[^/]+\/comments$/,
    /^\/api\/problems\/[^/]+\/comments\/[^/]+$/,
    // Favorites are allowed
    /^\/api\/problems\/[^/]+\/favourite$/,
    // Auth is always allowed
    /^\/api\/auth\/.*/,
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user or not in demo mode, proceed normally
    if (!user?.isDemoMode) {
      return next.handle();
    }

    const method = request.method;
    const path = request.path || request.url;

    // Allow read operations
    if (!this.mutatingMethods.includes(method)) {
      return next.handle();
    }

    // Check if route is in allowed list
    if (this.allowedRoutePatterns.some((regex) => regex.test(path))) {
      return next.handle();
    }

    // Block mutation with demo mode response
    throw new ForbiddenException({
      statusCode: 403,
      demoMode: true,
      message: "We're running you through a demo. You don't have permission to save changes.",
      contactTeam: [
        { name: 'Daniel', email: 'daniel@novademo.com' },
        { name: 'Jacques', email: 'jacques@novademo.com' },
        { name: 'Ray', email: 'ray@novademo.com' },
      ],
    });
  }
}
