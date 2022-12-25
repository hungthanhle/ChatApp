import {
  Get,
  Post,
  Body,
  Delete,
  Param,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationService } from './conversation.service';
import { ParseIntPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/Guards';
import { UserConversationService } from '../user_conversation/userConversation.service';
import { ConversationRepository } from './repos/conversation.repository';

// @UseGuards(AuthenticatedGuard)
@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly userConversationService: UserConversationService,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  @Get('/')
  async getall() {
    try {
      const conversations = await this.conversationService.findAll();
      if (!conversations) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return conversations;
    } catch {
      throw new HttpException('Error', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', ParseIntPipe) id: number) {
    try {
      const conversation = await this.conversationService.findById(id);
      if (!conversation) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return conversation;
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createConversationDto: CreateConversationDto) {
    try {
      await this.conversationService.create(createConversationDto);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    try {
      const conversation = await this.conversationService.findById(id);
      if (!conversation) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return await this.conversationService.update(
        conversation,
        createConversationDto,
      );
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.conversationService.deleteById(id);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //API TẠO ROOM (chat 1v1 hoặc group chat)
  @Post('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async createRoomForAuthor(
    @Body() createConversationDto: CreateConversationDto,
  ) {
    try {
      const conversation = await this.conversationService.create({
        title: createConversationDto.title ? createConversationDto.title : null,
        description: createConversationDto.description,
        last_message_id: null,
        pinned_message_id: null,
        author_id: createConversationDto.author_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.userConversationService.create({
        user_id: createConversationDto.author_id,
        conversation_id: conversation.id,
        mute: false,
        block: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { conversation };
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // API search
  // http://localhost:3000/conversations/1/search?q=1
  @Get('/:id/search')
  async searchMessage(
    @Param('id', ParseIntPipe) id: number,
    @Query('q') query,
  ) {
    console.log(id);
    console.log(query);
    const result = await this.conversationRepository
      .createQueryBuilder('conversations')
      .leftJoinAndSelect('conversations.messages', 'messages')
      .where(`conversations.id = ${id}`)
      .andWhere(`messages.fts_doc_en @@ websearch_to_tsquery('english', '${query}')`)
      .getMany();
    return result;
  }
}
