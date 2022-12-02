import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from './app.gateway';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../config/constants';
import { MessageRepository } from 'src/messages/repos/message.repository';
import { MessageService } from 'src/messages/message.service';
import { UserService } from 'src/users/user.service';
import { UserRepository } from 'src/users/repos/user.repository';
import { ConversationService } from 'src/conversations/conversation.service';
import { ConversationRepository } from 'src/conversations/repos/conversation.repository';
import { UserConversationService } from 'src/user_conversation/userConversation.service';
import { UserConversationRepository } from 'src/user_conversation/repos/userConversation.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      UserRepository,
      ConversationRepository,
      UserConversationRepository,
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  providers: [
    AppGateway,
    MessageService,
    UserService,
    ConversationService,
    UserConversationService,
  ],
  controllers: [],
})
export class GatewayModule {}
