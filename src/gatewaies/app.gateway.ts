import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MessageService } from '../messages/message.service';
import { UserService } from '../users/user.service';
import { ConversationService } from '../conversations/conversation.service';
import { UserConversationService } from '../user_conversation/userConversation.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  server;

  private logger = new Logger('MessageGateway');

  private ListOnlineUsers = [];

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private conversationService: ConversationService,
    private userConversationService: UserConversationService,
    private jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log(server, 'Init');
  }

  async handleConnection(socket: Socket) {
    this.logger.log(`${socket.id} connect`);
    const user = await this.getUserFromToken(socket);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      this.ListOnlineUsers.push(user.name);
      this.logger.log(`Online: ${this.ListOnlineUsers}`);
      this.server.emit('users', this.ListOnlineUsers);
    }
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log(`${socket.id} disconnect`);
    const user = await this.getUserFromToken(socket);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      const index = this.ListOnlineUsers.indexOf(user.name);
      if (index > -1) {
        this.ListOnlineUsers.splice(index, 1); //remove one item only
      }
      this.logger.log(`Online: ${this.ListOnlineUsers}`);
      this.server.emit('users', this.ListOnlineUsers);
    }
  }

  @SubscribeMessage('message')
  async onMessage(client: Socket, data) {
    const event = 'message';
    // const conversation = await this.conversationService.findById(
    //   data.conversation_id,
    //   ['users'],
    // );
    // const usersId = conversation.users.map((user) => {
    //   return user.id;
    // });
    const conversation = await this.conversationService.findByTitle(data.room);
    const usersId = await this.userConversationService.findUsers(
      conversation.id,
    );
    if (!conversation || !usersId.includes(data.user_id)) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const message = await this.messageService.create({
      user_id: data.user_id,
      status: true,
      message: data.message,
      conversation_id: conversation.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const messageId = message.id;

    await this.conversationService.updateLastMessageId(conversation, messageId);

    // client.to(data.room)
    this.server.to(data.room).emit(event, {
      id: message.id,
      message: message.message,
      conversation_id: message.conversation_id,
      user_id: message.user_id,
      status: message.status,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    });
  }

  @SubscribeMessage('join')
  async onRoomJoin(client, data: any): Promise<any> {
    const conversation = await this.conversationService.findByTitle(data.room);
    if (!conversation) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      const usersId = await this.userConversationService.findUsers(
        conversation.id,
      );
      if (!usersId.includes(data.user_id)) {
        //user_id constraint
        await this.userConversationService.create({
          conversation_id: conversation.id,
          user_id: data.user_id,
          mute: false,
          block: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      client.join(data.room);
      const message = await this.messageService.findById(
        conversation.last_message_id,
      );
      // Send last messages to the connected user
      client.emit('message', message);
    }
  }

  @SubscribeMessage('leave')
  onRoomLeave(client, room: any): void {
    client.leave(room);
  }

  async getUserFromToken(socket: Socket): Promise<User> {
    const authToken: any = socket.handshake?.query?.token;
    try {
      const payload = this.jwtService.verify(authToken);
      return await this.userService.findByUsername(payload.username);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
