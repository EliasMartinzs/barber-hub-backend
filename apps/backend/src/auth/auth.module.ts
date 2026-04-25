import { Global, Module } from '@nestjs/common';
import { AUTH_INSTANCE } from '../common/auth/auth';
import { createAuth } from '../common/auth/auth.instance';
import { PrismaModule } from '../common/prisma/prisma.module';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';

@Global()
@Module({
  imports: [PrismaModule, MailModule],
  providers: [
    {
      provide: AUTH_INSTANCE,
      useFactory: (prisma: PrismaService, mail: MailService) =>
        createAuth(prisma, mail),
      inject: [PrismaService, MailService],
    },
    AuthService,
  ],
  controllers: [AuthController],
  exports: [AUTH_INSTANCE, AuthService],
})
export class AuthModule {}
