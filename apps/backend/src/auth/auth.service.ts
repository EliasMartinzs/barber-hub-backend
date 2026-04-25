import { Inject, Injectable } from '@nestjs/common';
import { APIError } from 'better-auth/api';
import slugify from 'slugify';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { RequestResetPasswordDto } from 'src/auth/dto/request-reset-password.dto';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import type { BetterAuth } from '../better-auth';
import { AUTH_INSTANCE } from '../common/auth/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AUTH_INSTANCE) private readonly auth: BetterAuth,
  ) {}

  async register(body: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return {
        data: null,
        error: {
          message: 'Este email ja esta sendo ultilizado, tente outro',
          status: 'USER_ALREADY_EXIST',
        },
      };
    }

    const user = await this.auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        ...body,
      },
    });

    try {
      await this.prisma.$transaction(async (tx) => {
        const tenant = await tx.tenant.create({
          data: {
            name: body.tenantName,
            slug: this.generateTenantSlug(body.tenantName),
          },
        });

        await tx.membership.create({
          data: {
            tenantId: tenant.id,
            userId: user.response.user.id,
            role: 'OWNER',
          },
        });
      });

      return {
        data: user,
        error: null,
      };
    } catch (e) {
      await this.prisma.user.delete({
        where: {
          id: user.response.user.id,
        },
      });

      if (e instanceof APIError) {
        return {
          error: {
            message: e.message,
            status: e.status,
          },
        };
      }

      throw e;
    }
  }

  async login(body: LoginDto) {
    try {
      return await this.auth.api.signInEmail({
        returnHeaders: true,
        body,
      });
    } catch (e) {
      if (e instanceof APIError) {
        return { error: { message: e.message, status: e.status } };
      }

      throw e;
    }
  }

  async requestResetPassoword(body: RequestResetPasswordDto) {
    try {
      return await this.auth.api.requestPasswordReset({
        returnHeaders: true,
        body,
      });
    } catch (e) {
      if (e instanceof APIError) {
        return { error: { message: e.message, status: e.status } };
      }

      throw e;
    }
  }

  async resetPassword(body: ResetPasswordDto) {
    try {
      return await this.auth.api.resetPassword({
        returnHeaders: true,
        body: {
          newPassword: body.newPassword,
          token: body.token,
        },
      });
    } catch (e) {
      if (e instanceof APIError) {
        return { error: { message: e.message, status: e.status } };
      }

      throw e;
    }
  }

  async logout(headers: Headers) {
    return await this.auth.api.signOut({
      returnHeaders: true,
      headers,
    });
  }

  async getSession(headers: Headers) {
    return await this.auth.api.getSession({ headers });
  }

  generateTenantSlug(name: string) {
    const base = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const unique = crypto.randomUUID().slice(0, 6);

    return `${base}-${unique}`;
  }
}
