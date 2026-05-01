import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { s3Client } from 'src/common/S3/s3.service';
import { GetPresignedUrlDto } from 'src/upload/dto/get-presignedurl.dto';

@Injectable()
export class UploadService {
  async getPresignedUrl(params: GetPresignedUrlDto) {
    const { folder = 'general', contentType, fileName, fileSize } = params;

    const MAX_SIZE = 2 * 1024 * 1024;

    if (fileSize > MAX_SIZE) {
      throw new BadRequestException('Imagem muito grande. Máximo 2MB.');
    }

    if (!contentType) {
      throw new BadRequestException('contentType é obrigatório');
    }

    if (!contentType.startsWith('image/')) {
      throw new BadRequestException('Apenas imagens são permitidas');
    }

    const extension = contentType.split('/')[1] || 'jpg';

    const safeFileName = fileName
      ? fileName.replace(/\s+/g, '-')
      : `${randomUUID()}.${extension}`;

    const key = `tmp/${folder}/${randomUUID()}-${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 60 * 5,
    });

    return {
      key,
      url,
      publicUrl: `${process.env.AWS_PUBLIC_URL}/${key}`,
    };
  }

  async deleteFile(key: string) {
    if (!key) {
      throw new BadRequestException('key é obrigatória');
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: key,
    });

    await s3Client.send(command);

    return { message: 'Imagem deletada' };
  }
}
