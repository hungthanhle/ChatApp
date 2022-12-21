import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from './app.gateway';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../config/constants';
import { MessageRepository } from '../messages/repos/message.repository';
import { MessageService } from '../messages/message.service';
import { UserService } from '../users/user.service';
import { UserRepository } from '../users/repos/user.repository';
import { ConversationService } from '../conversations/conversation.service';
import { ConversationRepository } from '../conversations/repos/conversation.repository';
import { UserConversationService } from '../user_conversation/userConversation.service';
import { UserConversationRepository } from '../user_conversation/repos/userConversation.repository';

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
