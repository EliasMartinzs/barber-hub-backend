import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditServiceDto {
  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @IsOptional()
  price!: string;

  @IsInt()
  @IsOptional()
  durationInMinutes!: number;

  @IsBoolean()
  @IsOptional()
  isActive!: boolean;

  @IsString()
  @IsOptional()
  imageUrl!: string;

  @IsInt()
  @IsOptional()
  order!: number;
}
