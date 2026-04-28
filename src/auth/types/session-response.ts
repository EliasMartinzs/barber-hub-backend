export type SessionResponse = {
  user: {
    slug: string | undefined;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    email?: string | undefined;
    emailVerified?: boolean | undefined;
    name?: string | undefined;
    image?: string | null | undefined;
  };
  session?:
    | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      }
    | undefined;
};
