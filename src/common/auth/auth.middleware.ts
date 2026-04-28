import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/common/prisma/prisma.service';
import type { BetterAuth } from '../../better-auth';
import { AUTH_INSTANCE } from './auth';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(AUTH_INSTANCE) private readonly auth: BetterAuth,
    private readonly prisma: PrismaService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    try {
      const session = await this.auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session?.user) {
        (req as any).session = null;
        return next();
      }

      const membership = await this.prisma.membership.findUnique({
        where: {
          userId: session.user.id,
        },
        select: {
          tenantId: true,
          role: true,
        },
      });

      (req as any).session = {
        ...session,
        tenantId: membership?.tenantId,
        role: membership?.role,
      };
    } catch (e) {
      (req as any).session = null;
    }
    next();
  }
}
