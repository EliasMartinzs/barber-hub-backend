import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';

export const createAuth = (prisma: PrismaService, mailService: MailService) =>
  betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    appName: process.env.APP_NAME ?? 'YOUR_APP',
    secret: process.env.BETTER_AUTH_SECRET ?? 'secret',
    baseURL: process.env.BETTER_AUTH_BASE_URL || 'http://localhost:3000',
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
      maxPasswordLength: 64,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url, token }, request) => {
        const fixedUrl = decodeURIComponent(url);

        await mailService.sendEmail({
          to: user.email,
          subject: 'Reset your password',
          template: 'signup-confirmation-template',
          context: {
            name: user.name,
            url: fixedUrl,
          },
        });
      },

      onPasswordReset: async ({ user }, request) => {},
    },
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    emailVerification: {
      sendOnSignUp: true,

      sendVerificationEmail: async ({ user, token, url }) => {
        const fixedUrl = decodeURIComponent(url);

        await mailService.sendEmail({
          to: user.email,
          subject: 'Verify your email address',
          template: 'send-email-verification-template',
          context: {
            name: user.name,
            url: fixedUrl,
          },
        });
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 40 * 24,
      freshAge: 60 * 60 * 2,
    },
    advanced: {
      cookies: {
        session_token: {
          name: 'better-auth.session_token',
          options: {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
          },
        },
      },
    },
    trustedOrigins: ['http://localhost:3000', 'http://localhost:3001'],
  });
