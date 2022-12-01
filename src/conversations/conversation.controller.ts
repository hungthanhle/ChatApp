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
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationService } from './conversation.service';
import { ParseIntPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

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

  @Post('/')
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
}
