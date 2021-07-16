import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { response, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Res() response: Response) {
    const access_token = await this.authService.login(req.user);
    const cookie_token = await this.authService.getCookieWithJwtToken(
      access_token,
    );

    response.setHeader('Set-Cookie', cookie_token);

    return response.json({ success: true });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.removeCookieLogOut());

    return response.json({ success: true, message: 'logout' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
