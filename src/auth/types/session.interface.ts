import authClient from 'src/common/auth/auth-client';

type BaseSession = typeof authClient.$Infer.Session;

export type SessionType = BaseSession & {
  tenantId?: string;
  role?: string;
};

export type UserType = BaseSession['user'];
