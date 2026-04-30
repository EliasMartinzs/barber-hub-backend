import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetPresignedUrlDto {
  @IsOptional()
  @IsString()
  folder?: string;

  @IsString()
  contentType!: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @Type(() => Number)
  @IsNumber()
  fileSize!: number;
}
