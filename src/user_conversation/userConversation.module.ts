import { Module } from '@nestjs/common';
import { UserConversationController } from './userConversation.controller';
import { UserConversationService } from './userConversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConversationRepository } from './repos/userConversation.repository';
import { ConversationModule } from 'src/conversations/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserConversationRepository]),
    ConversationModule,
  ],
  controllers: [UserConversationController],
  providers: [UserConversationService],
  exports: [UserConversationService],
})
export class UserConversationModule {}
