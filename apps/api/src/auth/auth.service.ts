import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create tenant and user in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name: dto.tenantName || `${dto.email}'s Organization`,
        },
      });

      // Create user as admin of the new tenant
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          tenantId: tenant.id,
          role: 'ADMIN',
        },
      });

      return { user, tenant };
    });

    // Generate JWT
    const payload: JwtPayload = {
      sub: result.user.id,
      email: result.user.email,
      tenantId: result.user.tenantId,
      role: result.user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName ?? undefined,
        lastName: result.user.lastName ?? undefined,
        role: result.user.role,
        tenantId: result.user.tenantId,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true },
    });
  }

  async registerVoter(dto: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Get or create the shared "Public Voters" tenant
    let votersTenant = await this.prisma.tenant.findFirst({
      where: { name: 'Public Voters' },
    });

    if (!votersTenant) {
      votersTenant = await this.prisma.tenant.create({
        data: {
          name: 'Public Voters',
        },
      });
    }

    // Create user as VOTER role
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        tenantId: votersTenant.id,
        role: 'VOTER',
      },
    });

    // Generate JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}
