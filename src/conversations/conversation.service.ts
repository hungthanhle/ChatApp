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
    conversation.last_message_id = null;
    conversation.pinned_message_id = null;
    conversation.author_id = createConversationDto.author_id;
    conversation.createdAt = new Date();
    conversation.updatedAt = conversation.createdAt;
    return await this.conversationRepository.save(conversation);
  }

  async findById(
    id: number,
    relations: string[] = [],
  ): Promise<Conversation | null> {
    return await this.conversationRepository.findOne({
      where: { id },
      relations,
    });
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

  async findByTitle(
    title: string,
    relations: string[] = [],
  ): Promise<Conversation | null> {
    return await this.conversationRepository.findOne({
      where: { title },
      relations,
    });
  }

  async updateLastMessageId(entity: Conversation, last_messages_id: number) {
    const result = { ...entity };
    result.last_message_id = last_messages_id;
    result.updatedAt = new Date();
    return await this.conversationRepository.update(entity, result);
  }

  async updateLastMessage(conversation_id: number, last_messages_id: number) {
    const entity = await this.conversationRepository.findOne({
      id: conversation_id,
    });
    const result = { ...entity };
    result.last_message_id = last_messages_id;
    result.updatedAt = new Date();
    return await this.conversationRepository.update(entity, result);
  }
}
