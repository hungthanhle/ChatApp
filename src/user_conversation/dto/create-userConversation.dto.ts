export class CreateUserConversationDto {
  user_id: number;
  conversation_id: number;
  mute: boolean;
  block: boolean;
  createdAt: Date;
  updatedAt: Date;
}
