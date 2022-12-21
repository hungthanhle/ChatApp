import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { compareHash } from '../utils/helpers';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(userDetails) {
    const user = await this.userService.findByUsername(userDetails.username);
    if (!user)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    const isPasswordValid = await compareHash(
      userDetails.password,
      user.password,
    );
    return isPasswordValid ? user : null;
  }
}
