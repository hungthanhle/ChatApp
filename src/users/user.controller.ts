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
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ParseIntPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getall() {
    try {
      const users = await this.userService.findAll();
      if (!users) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return users;
    } catch {
      throw new HttpException('Error', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return await this.userService.update(user, createUserDto);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.userService.deleteById(id);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
