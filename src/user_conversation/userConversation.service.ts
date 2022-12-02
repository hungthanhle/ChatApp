import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserConversationRepository } from './repos/userConversation.repository';
import { UserConversation } from './entities/userConversation.entity';
import { CreateUserConversationDto } from './dto/create-userConversation.dto';

@Injectable()
export class UserConversationService {
  constructor(
    @InjectRepository(UserConversationRepository)
    private userConversationRepository: UserConversationRepository,
  ) {}

  async findAll(): Promise<UserConversation[]> {
    return await this.userConversationRepository.find();
  }

  async create(
    createUserConversationDto: CreateUserConversationDto,
  ): Promise<UserConversation> {
    const userConversation = new UserConversation();
    userConversation.conversation_id =
      createUserConversationDto.conversation_id;
    userConversation.user_id = createUserConversationDto.user_id;
    userConversation.mute = createUserConversationDto.mute;
    userConversation.block = createUserConversationDto.block;
    userConversation.createdAt = new Date();
    userConversation.updatedAt = userConversation.createdAt;
    return await this.userConversationRepository.save(userConversation);
  }

  async findById(id: number): Promise<UserConversation | null> {
    return await this.userConversationRepository.findOne({ id });
  }

  async update(
    userConversation: UserConversation,
    createUserConversationDto: CreateUserConversationDto,
  ) {
    createUserConversationDto.updatedAt = new Date();
    return await this.userConversationRepository.update(
      userConversation,
      createUserConversationDto,
    );
  }

  async deleteById(id: number): Promise<void> {
    await this.userConversationRepository.delete({ id });
  }

  async findUsers(conversation_id: number) {
    const usersConversation = await this.userConversationRepository.find({
      conversation_id,
    });
    const usersId = usersConversation.map((item) => {
      return item.user_id;
    });
    return usersId;
  }

  async findConversations(user_id: number, relations: string[] = []) {
    const userConversation = await this.userConversationRepository.find({
      where: { user_id },
      relations,
    });
    const conversations = userConversation.map((item) => {
      return item.conversation;
    });
    return conversations;
  }
}
