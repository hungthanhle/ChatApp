import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from './app.gateway';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../config/constants';
import { MessageRepository } from 'src/messages/repos/message.repository';
import { MessageService } from 'src/messages/message.service';
import { UserService } from 'src/users/user.service';
import { UserRepository } from 'src/users/repos/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageRepository, UserRepository]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  providers: [AppGateway, MessageService, UserService],
  controllers: [],
})
export class GatewayModule {}
