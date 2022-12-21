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
  UploadedFile,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { FileService } from './file.service';
import { ParseIntPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { SendFileDto } from './dto/send-file.dto';

// @UseGuards(JwtAuthGuard)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now();
          const ext = extname(file.originalname);
          const filename = `${file.originalname} - ${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file,
    @Body() sendFile: SendFileDto,
  ): Promise<any> {
    try {
      await this.fileService.create({
        name: file.filename,
        url: file.path,
        author_id: sendFile.user_id,
        createdAt: new Date(),
      });
      return file;
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/')
  async getall() {
    try {
      const files = await this.fileService.findAll();
      if (!files) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return files;
    } catch {
      throw new HttpException('Error', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', ParseIntPipe) id: number) {
    try {
      const file = await this.fileService.findById(id);
      if (!file) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return file;
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.fileService.deleteById(id);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
