export class CreateMessageDto {
  user_id: number | null;
  conversation_id: number;
  status: boolean;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
