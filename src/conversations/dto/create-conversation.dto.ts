export class CreateConversationDto {
  title: string;
  description: string;
  last_message_id: number | null;
  createdAt: Date;
  updatedAt: Date;
}
