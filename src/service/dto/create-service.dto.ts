import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @IsNotEmpty()
  price!: string;

  @IsInt()
  @IsNotEmpty()
  durationInMinutes!: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  @IsString()
  @IsOptional()
  imageUrl!: string;

  @IsInt()
  @IsNotEmpty()
  order!: number;
}
