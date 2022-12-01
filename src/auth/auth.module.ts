import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from '../config/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from 'src/users/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repos/user.repository';

@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
