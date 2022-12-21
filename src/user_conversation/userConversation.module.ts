import { Module } from '@nestjs/common';
import { UserConversationController } from './userConversation.controller';
import { UserConversationService } from './userConversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConversationRepository } from './repos/userConversation.repository';
import { ConversationModule } from '../conversations/conversation.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserConversationRepository]), UserModule],
  controllers: [UserConversationController],
  providers: [UserConversationService],
  exports: [UserConversationService],
})
export class UserConversationModule {}
