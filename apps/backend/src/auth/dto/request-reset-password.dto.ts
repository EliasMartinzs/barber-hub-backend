import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  redirectTo: string;
}
