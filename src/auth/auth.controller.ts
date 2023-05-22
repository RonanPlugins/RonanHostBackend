import { Controller, Post, UseGuards, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';

import * as dotenv from 'dotenv';
dotenv.config();

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const delay = Math.floor(Math.random() * 200);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const payload = { username: req.user.username, id: req.user.id };
    const token = this.jwtService.sign(payload);
    const expirationDate = new Date(Date.now() + 2592000 * 1000); // 30 days
    res.cookie('token', token, { httpOnly: false, expires: expirationDate });
    return req.user;
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    console.log('logout');
    res.clearCookie('token');
    return { done: true };
  }
}
