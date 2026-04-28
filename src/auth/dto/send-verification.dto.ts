import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendVerificationDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  callbackURL!: string;
}
