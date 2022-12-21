import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Response,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedGuard, LocalAuthGuard } from './guards/Guards';
import { UserService } from '../users/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get('login')
  getLogin(@Response() res) {
    res.sendFile(process.cwd() + '/client/login.html');
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Response() res) {
    return res.sendStatus(HttpStatus.OK);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getProfile(@Request() req, @Session() session: Record<string, any>) {
    console.log(`Profile: ${session.id}`);
    return { user: req.user, session };
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Request() req, @Response() res) {
    req.logout((err) => {
      return err ? res.sendStatus(400) : res.sendStatus(200);
    });
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
