import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from 'src/common/auth/types/session-request';

export const CurrentTenant = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();

    const tenantId = req.session?.tenantId;

    if (!tenantId) {
      throw new UnauthorizedException();
    }

    return tenantId;
  },
);
