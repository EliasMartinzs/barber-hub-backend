import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from 'src/common/auth/types/session-request';

export const CurrentRole = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();

    const role = req.session?.role;

    if (!role) {
      throw new UnauthorizedException();
    }

    return role;
  },
);
