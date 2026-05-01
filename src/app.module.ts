import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './common/auth/auth.middleware';
import { PrismaModule } from './common/prisma/prisma.module';
import { PrismaService } from './common/prisma/prisma.service';
import { JobsModule } from './jobs/jobs.module';
import { MailModule } from './mail/mail.module';
import { ServiceModule } from './service/service.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    MailModule,
    ServiceModule,
    UploadModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
