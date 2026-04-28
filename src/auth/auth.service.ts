import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { APIError } from 'better-auth/api';
import slugify from 'slugify';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { RequestResetPasswordDto } from 'src/auth/dto/request-reset-password.dto';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { SendVerificationDto } from 'src/auth/dto/send-verification.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import type { BetterAuth } from '../better-auth';
import { AUTH_INSTANCE } from '../common/auth/auth';
import { authErrorMap } from './types/erros-code.auth';

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
      throw new ConflictException('Email já está em uso');
    }

    const user = await this.auth.api.signUpEmail({
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
            ownerId: user.user.id,
          },
        });

        await tx.membership.create({
          data: {
            tenantId: tenant.id,
            userId: user.user.id,
            role: 'OWNER',
          },
        });
      });

      return {
        user: user.user,
      };
    } catch (e) {
      await this.prisma.user.delete({
        where: { id: user.user.id },
      });

      if (e instanceof APIError) {
        const code = e.body?.code!;

        const message = authErrorMap[code] ?? 'Erro inesperado';

        throw new HttpException({ message }, e.statusCode ?? 400);
      }

      throw e;
    }
  }

  async login(body: LoginDto) {
    try {
      const result = await this.auth.api.signInEmail({
        returnHeaders: true,
        body,
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: result.response.user.id,
        },
        select: {
          tenant: {
            select: {
              slug: true,
            },
          },
        },
      });

      if (!user?.tenant?.slug) {
        throw new UnauthorizedException(
          'Usuário não possui uma barbearia associada',
        );
      }

      return {
        headers: result.headers,
        user: {
          ...result.response.user,
          slug: user?.tenant?.slug,
        },
      };
    } catch (e) {
      if (e instanceof APIError) {
        const code = e.body?.code!;

        const message = authErrorMap[code] ?? 'Erro inesperado';

        throw new HttpException({ message, code }, e.statusCode ?? 400);
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
        const code = e.body?.code!;

        const message = authErrorMap[code] ?? 'Erro inesperado';

        throw new HttpException({ message }, e.statusCode ?? 400);
      }

      throw e;
    }
  }

  async sendEmailVerification(body: SendVerificationDto) {
    try {
      return await this.auth.api.sendVerificationEmail({
        returnHeaders: true,
        body: {
          ...body,
        },
      });
    } catch (e) {
      if (e instanceof APIError) {
        const code = e.body?.code!;

        const message = authErrorMap[code] ?? 'Erro inesperado';

        throw new HttpException({ message }, e.statusCode ?? 400);
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
        const code = e.body?.code!;

        const message = authErrorMap[code] ?? 'Erro inesperado';

        throw new HttpException({ message }, e.statusCode ?? 400);
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
    const result = await this.auth.api.getSession({ headers });

    const user = await this.prisma.user.findUnique({
      where: {
        id: result?.user.id,
      },
      select: {
        tenant: {
          select: {
            slug: true,
          },
        },
      },
    });

    return {
      ...result,
      user: {
        ...result?.user,
        slug: user?.tenant?.slug,
      },
    };
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
