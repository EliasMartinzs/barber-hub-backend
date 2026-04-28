import {
  All,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { RequestResetPasswordDto } from 'src/auth/dto/request-reset-password.dto';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { SendVerificationDto } from 'src/auth/dto/send-verification.dto';
import { LoginResponse } from 'src/auth/types/login-response';
import { SessionResponse } from 'src/auth/types/session-response';
import { AUTH_INSTANCE } from 'src/common/auth/auth';
import { AuthService } from './auth.service';

@ApiTags('api/auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(AUTH_INSTANCE) private readonly auth: any,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<{ message: string }> {
    await this.authService.register(body);

    return {
      message: 'Se o email estiver cadastrado, enviaremos um email.',
    };
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const result = await this.authService.login(body);

    const setCookie = result.headers.get('set-cookie');
    if (setCookie) res.setHeader('set-cookie', setCookie);

    res.cookie('tenant_slug', result.user.slug, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      user: result.user,
    };
  }

  @Post('request-reset-password')
  async requestResetPassoword(
    @Body() body: RequestResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.requestResetPassoword(body);

    return {
      message: 'Se o email estiver cadastrado, enviaremos instruções.',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(body);

    return {
      message: 'Senha trocada com sucesso',
    };
  }

  @Post('send-verification-email')
  async sendVerificationEmail(
    @Body() body: SendVerificationDto,
  ): Promise<{ message: string }> {
    await this.authService.sendEmailVerification(body);

    return {
      message: 'Se o email estiver cadastrado, enviaremos instruções.',
    };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const headers = new Headers();
    const cookie = req.headers.cookie;
    if (cookie) headers.set('cookie', cookie);

    const result = await this.authService.logout(headers);

    const setCookie = result.headers?.get('set-cookie');
    if (setCookie) res.setHeader('set-cookie', setCookie);

    return {
      message: 'Logout successfully',
    };
  }

  @Get('me')
  async me(@Req() req: Request): Promise<SessionResponse> {
    const headers = new Headers();
    const cookie = req.headers.cookie;
    if (cookie) headers.set('cookie', cookie);

    return await this.authService.getSession(headers);
  }

  @All('*')
  async handler(@Req() req: any, @Res() res: any) {
    const url = `http://${req.headers.host}${req.originalUrl}`;
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') {
        headers.set(key, value);
      }
    }

    const body =
      req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body;

    const webRequest = new Request(url, {
      method: req.method,
      headers,
      body,
    });

    const response = await this.auth.handler(webRequest);

    res.status(response.status);

    response.headers.forEach((v, k) => res.setHeader(k, v));

    const data = await response.text();

    return res.send(data);
  }
}
