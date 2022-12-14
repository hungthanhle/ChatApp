import { Module } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/LocalStrategy';
import { SessionSerializer } from './strategies/SessionSerializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repos/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [AuthController],
  providers: [LocalStrategy, SessionSerializer, AuthService, UserService],
})
export class AuthModule {}
