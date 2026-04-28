import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from 'src/common/auth/types/session-request';
import type { UserType } from '../../../auth/types/session.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof UserType | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();

    const user = req.session?.user;

    console.log(user);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!data) return user;

    return user[data];
  },
);
