import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  _Object,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { s3Client } from 'src/common/S3/s3.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanup() {
    const bucket = process.env.AWS_BUCKET!;
    const TTL = 1000 * 60 * 60;
    const now = Date.now();

    const start = Date.now();
    let totalScanned = 0;
    let totalDeleted = 0;

    try {
      let continuationToken: string | undefined;

      do {
        const res = await s3Client.send(
          new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: 'tmp/',
            ContinuationToken: continuationToken,
            MaxKeys: 1000,
          }),
        );

        const files: _Object[] = res.Contents || [];
        totalScanned += files.length;

        const toDelete = files
          .filter((file) => {
            if (!file.Key || !file.LastModified) return false;

            const age = now - new Date(file.LastModified).getTime();

            return age > TTL;
          })
          .map((file) => ({
            Key: file.Key!,
          }));

        if (toDelete.length > 0) {
          await s3Client.send(
            new DeleteObjectsCommand({
              Bucket: bucket,
              Delete: {
                Objects: toDelete,
                Quiet: true,
              },
            }),
          );

          totalDeleted += toDelete.length;

          this.logger.log(
            `🧹 Deletados ${toDelete.length} arquivos nesta página`,
          );
        }

        continuationToken = res.IsTruncated
          ? res.NextContinuationToken
          : undefined;
      } while (continuationToken);

      this.logger.log(
        `✅ Cleanup finalizado | Scanned: ${totalScanned} | Deleted: ${totalDeleted} | Tempo: ${
          Date.now() - start
        }ms`,
      );
    } catch (err) {
      this.logger.error('❌ Erro no cleanup', err);
    }
  }
}
