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
import type { User } from 'better-auth';
import type { Request, Response } from 'express';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { RequestResetPasswordDto } from 'src/auth/dto/request-reset-password.dto';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { LoginResponse } from 'src/auth/types/login-response';
import { AUTH_INSTANCE } from 'src/common/auth/auth';
import { ApiResponse } from 'src/types/api-response';
import { AuthService } from './auth.service';

@ApiTags('api/auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(AUTH_INSTANCE) private readonly auth: any,
  ) {}

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<User>> {
    const result = await this.authService.register(body);

    if (result.error) {
      return {
        data: null,
        error: {
          message: result.error.message,
          status: String(result.error.status),
        },
      };
    }

    const setCookie = result.data?.headers?.get('set-cookie');
    if (setCookie) res.setHeader('set-cookie', setCookie);

    return {
      data: result.data.response.user,
      error: null,
    };
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<LoginResponse>> {
    const result = await this.authService.login(body);

    if ('error' in result) {
      return {
        data: null,
        error: {
          message: result.error.message,
          status: String(result.error.status),
        },
      };
    }

    const setCookie = result.headers.get('set-cookie');
    if (setCookie) res.setHeader('set-cookie', setCookie);

    return {
      data: result.response,
      error: null,
    };
  }

  @Post('request-reset-password')
  async requestResetPassoword(
    @Body() body: RequestResetPasswordDto,
  ): Promise<ApiResponse<string>> {
    const result = await this.authService.requestResetPassoword(body);

    if ('error' in result) {
      return {
        data: null,
        error: {
          message: result.error.message,
        },
      };
    }

    return {
      data: result.response.message,
      error: null,
    };
  }

  @Post('reset-password')
  async ResetPassoword(
    @Body() body: ResetPasswordDto,
  ): Promise<ApiResponse<null>> {
    const result = await this.authService.resetPassword(body);

    if ('error' in result) {
      return {
        data: null,
        error: {
          message: result.error.message,
        },
      };
    }

    return {
      data: null,
      error: null,
    };
  }

  @Post('test commit no pr')
  async test() {}

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const headers = new Headers();
    const cookie = req.headers.cookie;
    if (cookie) headers.set('cookie', cookie);

    const result = await this.authService.logout(headers);

    const setCookie = result.headers?.get('set-cookie');
    if (setCookie) res.setHeader('set-cookie', setCookie);

    return result.response;
  }

  @Get('me')
  async me(@Req() req: Request) {
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
