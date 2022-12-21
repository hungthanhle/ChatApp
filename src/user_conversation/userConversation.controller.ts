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
import { AddMultipleUsersDto } from './dto/addMultipleUser.dto';
import { UserService } from 'src/users/user.service';

@UseGuards(AuthenticatedGuard)
@Controller('user-conversation')
export class UserConversationController {
  constructor(
    private readonly userConversationService: UserConversationService,
    private readonly userService: UserService,
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

  //API ADD MULTIPLE USERS (Vào chat 1v1 hoặc group chat)
  @Post('/')
  async addMultipleUsers(@Body() addMultipleUsersDto: AddMultipleUsersDto) {
    const numberUsers = addMultipleUsersDto.array_user_phone.length;
    const usersAdded = [];
    try {
      for (let i = 0; i < numberUsers; i++) {
        const user = await this.userService.findByPhone(
          addMultipleUsersDto.array_user_phone[i],
        );
        const userConversation = await this.userConversationService.create({
          conversation_id: addMultipleUsersDto.conversation_id,
          user_id: user.id,
          mute: false,
          block: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        usersAdded.push(userConversation.user_id);
      }
      return {
        conversation_id: addMultipleUsersDto.conversation_id,
        array_user_id: usersAdded,
      };
    } catch {
      return {
        conversation_id: addMultipleUsersDto.conversation_id,
        array_user_id: usersAdded,
      };
    }
  }

  @Get('/')
  async getRoom(@Response() res) {
    res.sendFile(process.cwd() + '/client/client.html');
  }
}
