import { Module } from '@nestjs/common';
import { UserConversationController } from './userConversation.controller';
import { UserConversationService } from './userConversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConversationRepository } from './repos/userConversation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserConversationRepository])],
  controllers: [UserConversationController],
  providers: [UserConversationService],
  exports: [UserConversationService],
})
export class UserConversationModule {}
