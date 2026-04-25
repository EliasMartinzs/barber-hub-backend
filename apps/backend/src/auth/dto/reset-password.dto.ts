import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
