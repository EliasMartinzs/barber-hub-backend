import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/auth/guards/auth.guard';
import { GetPresignedUrlDto } from 'src/upload/dto/get-presignedurl.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard)
  @Get('presigned')
  async getPresignedUrl(@Query() query: GetPresignedUrlDto) {
    return this.uploadService.getPresignedUrl({
      folder: query.folder,
      contentType: query.contentType,
      fileName: query.fileName,
      fileSize: query.fileSize,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('file')
  deleteFile(@Query('key') key: string) {
    return this.uploadService.deleteFile(key);
  }
}
