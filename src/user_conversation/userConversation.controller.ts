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
} from '@nestjs/common';
import { CreateUserConversationDto } from './dto/create-userConversation.dto';
import { UserConversationService } from './userConversation.service';
import { ParseIntPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user-conversation')
export class UserConversationController {
  constructor(
    private readonly userConversationService: UserConversationService,
  ) {}

  @Get('/')
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

  @Post('/')
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
}
