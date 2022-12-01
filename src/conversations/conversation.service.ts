import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationRepository } from './repos/conversation.repository';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationRepository)
    private conversationRepository: ConversationRepository,
  ) {}

  async findAll(): Promise<Conversation[]> {
    return await this.conversationRepository.find();
  }

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const conversation = new Conversation();
    conversation.title = createConversationDto.title;
    conversation.description = createConversationDto.description;
    conversation.createdAt = new Date();
    conversation.updatedAt = conversation.createdAt;
    return await this.conversationRepository.save(conversation);
  }

  async findById(id: number): Promise<Conversation | null> {
    return await this.conversationRepository.findOne({ id });
  }

  async update(
    conversation: Conversation,
    createConversationDto: CreateConversationDto,
  ) {
    conversation.updatedAt = new Date();
    return await this.conversationRepository.update(
      conversation,
      createConversationDto,
    );
  }

  async deleteById(id: number): Promise<void> {
    await this.conversationRepository.delete({ id });
  }
}
