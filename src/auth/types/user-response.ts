import { Prisma } from 'src/generated/prisma';

export type UserResponse = Prisma.UserGetPayload<{
  include: {
    tenant: true;
    memberships: {
      select: {
        role: true;
      };
    };
    customer: true;
  };
}>;
