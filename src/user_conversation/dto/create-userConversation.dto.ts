export class CreateUserConversationDto {
  user_id: number;
  conversation_id: number;
  mute: boolean;
  block: boolean;
  last_message_id: number;
  createdAt: Date;
  updatedAt: Date;
}
