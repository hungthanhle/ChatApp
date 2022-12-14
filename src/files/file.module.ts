import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileRepository } from './repos/file.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FileRepository])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
