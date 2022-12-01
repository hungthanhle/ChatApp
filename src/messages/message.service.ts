import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRepository } from './repos/message.repository';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
  ) {}

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = new Message();
    message.conversation_id = createMessageDto.conversation_id;
    message.user_id = createMessageDto.user_id;
    message.status = createMessageDto.status;
    message.message = createMessageDto.message;
    message.createdAt = new Date();
    message.updatedAt = message.createdAt;
    return await this.messageRepository.save(message);
  }

  async findById(id: number): Promise<Message | null> {
    return await this.messageRepository.findOne({ id });
  }

  async update(message: Message, createMessageDto: CreateMessageDto) {
    createMessageDto.updatedAt = new Date();
    return await this.messageRepository.update(message, createMessageDto);
  }

  async deleteById(id: number): Promise<void> {
    await this.messageRepository.delete({ id });
  }
}
