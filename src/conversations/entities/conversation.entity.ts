import { IConversation } from '../interfaces/conversation.interface';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';
import { UserConversation } from '../../user_conversation/entities/userConversation.entity';

@Entity({ name: 'conversations' })
export class Conversation implements IConversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description', length: 5000 })
  description: string;

  @Column({ name: 'last_message_id', nullable: true })
  last_message_id: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Message, (message) => message.conversation)
  messages?: Message[];

  @OneToMany(
    () => UserConversation,
    (userConversation) => userConversation.conversation,
  )
  userConversation?: UserConversation[];

  @ManyToMany(() => User, (users) => users.conversations)
  users: User[];
}
