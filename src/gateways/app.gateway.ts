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
// import { ConversationService } from '../conversations/conversation.service';
// import { UserConversationService } from '../user_conversation/userConversation.service';
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
    // private conversationService: ConversationService,
    // private userConversationService: UserConversationService,
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
    }
  }

  @SubscribeMessage('message')
  async handleMessage(socket: Socket, payload) {
    // const conversation = await this.conversationService.findById(
    //   payload.conversation_id,
    // );

    // const userId = [];
    // conversation.users.map((user) => {
    //   userId.push(user.id);

    //   return user;
    // });

    const message = await this.messageService.create({
      user_id: payload.user_id,
      status: false,
      message: payload.message,
      conversation_id: payload.conversation_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // const dataUserConversation =
    //   await this.userConversationService.findDataUserConversation(
    //     message.user_id,
    //     message.conversation_id,
    //   );

    // const messageId =
    //   typeof message.id === 'string' ? parseInt(message.id) : message.id;

    // await this.userConversationService.updateLastMessageId(
    //   dataUserConversation,
    //   messageId,
    // );

    // dataSocketId.map((value) => {
    //   this.server.to(value.value).emit('message-received', {
    //     id: message.id,
    //     message: message.message,
    //     conversation_id: message.conversation_id,
    //     user_id: message.user_id,
    //     status: message.status,
    //     createdAt: message.createdAt,
    //     updatedAt: message.updatedAt,
    //   });
    // });
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

  // @SubscribeMessage('room')
  // handleRoom(@MessageBody() message): void {
  //   console.log(message);
  // }
}
