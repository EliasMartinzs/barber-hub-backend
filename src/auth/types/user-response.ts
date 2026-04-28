import { Prisma } from 'src/generated/prisma';

export type UserResponse = Prisma.UserGetPayload<{
  include: {
    memberships: {
      select: {
        role: true;
        tenant: true;
      };
    };
    customer: true;
  };
}>;
