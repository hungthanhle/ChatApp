import {
  Get,
  Post,
  Controller,
  Request,
  UseGuards,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response({ passthrough: true }) res) {
    const result = await this.authService.login(req.user);
    res.cookie('access_token', result.access_token);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async getUserLogout(@Response() res) {
    res.setHeader('Set-Cookie', 'Authentication=; HttpOnly; Path=/; Max-Age=0');
    res.clearCookie('access_token');
    res.clearCookie('token');

    return res.sendStatus(200);
  }
}
