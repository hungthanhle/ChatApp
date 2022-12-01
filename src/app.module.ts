import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './messages/message.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import config from '../ormconfig';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppGateway } from './gateways/app.gateway';
import { join } from 'path';
import { GatewayModule } from './gateways/gateway.module';
import { ConversationModule } from './conversations/conversation.module';
import { UserConversationModule } from './user_conversation/userConversation.module';
/*
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
*/
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    MessageModule,
    UserModule,
    AuthModule,
    ConversationModule,
    UserConversationModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
