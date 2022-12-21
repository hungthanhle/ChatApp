import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConversationModule } from '../user_conversation/userConversation.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationRepository } from './repos/conversation.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationRepository]),
    UserConversationModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
