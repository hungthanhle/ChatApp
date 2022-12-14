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
  Response,
} from '@nestjs/common';
import { CreateUserConversationDto } from './dto/create-userConversation.dto';
import { UserConversationService } from './userConversation.service';
import { ParseIntPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/Guards';
import { ConversationService } from 'src/conversations/conversation.service';

@UseGuards(AuthenticatedGuard)
@Controller('user-conversation')
export class UserConversationController {
  constructor(
    private readonly userConversationService: UserConversationService,
    private readonly conversationService: ConversationService,
  ) {}

  async getall() {
    try {
      const userConversations = await this.userConversationService.findAll();
      if (!userConversations) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return userConversations;
    } catch {
      throw new HttpException('Error', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', ParseIntPipe) id: number) {
    try {
      const userConversation = await this.userConversationService.findById(id);
      if (!userConversation) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return userConversation;
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createUserConversationDto: CreateUserConversationDto) {
    try {
      await this.userConversationService.create(createUserConversationDto);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserConversationDto: CreateUserConversationDto,
  ) {
    try {
      const userConversation = await this.userConversationService.findById(id);
      if (!userConversation) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return await this.userConversationService.update(
        userConversation,
        createUserConversationDto,
      );
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.userConversationService.deleteById(id);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/conversations/:id')
  async getConversation(@Param('id', ParseIntPipe) id: number) {
    try {
      const conversations =
        await this.userConversationService.findConversations(id);
      if (!conversations) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return conversations;
    } catch {
      throw new HttpException('Error', HttpStatus.NOT_FOUND);
    }
  }

  @Post('/')
  async newRoom(@Body() data: any) {
    const conversation = await this.conversationService.create({
      title: data.room,
      description: data.description,
      last_message_id: null,
      pinned_message_id: null,
      author_id: data.user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const userConversation = await this.userConversationService.create({
      conversation_id: conversation.id,
      user_id: data.user_id,
      mute: false,
      block: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { conversation };
  }

  @Get('/')
  async getRoom(@Response() res) {
    res.sendFile(process.cwd() + '/client/client.html');
  }
}
