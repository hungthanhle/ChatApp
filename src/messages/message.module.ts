import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageRepository } from './repos/message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MessageRepository])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
