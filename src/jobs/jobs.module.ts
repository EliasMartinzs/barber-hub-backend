import { Module } from '@nestjs/common';
import { CleanupService } from './cleanup/cleanup.service';

@Module({
  providers: [CleanupService],
})
export class JobsModule {}
