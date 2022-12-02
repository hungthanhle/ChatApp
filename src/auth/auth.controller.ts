import {
  Get,
  Post,
  Controller,
  Request,
  UseGuards,
  Response,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserService } from 'src/users/user.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

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

  @Post('/register')
  async registerUser(@Body() input) {
    const user = await this.validate(input.email);
    if (user) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.create(input);
  }

  async validate(email: string) {
    try {
      const user = await this.userService.findByEmail(email);
      return user;
    } catch {
      return false;
    }
  }
}
