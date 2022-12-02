import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

import * as dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + '/.env' });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(process.env.PORT);
}
bootstrap();