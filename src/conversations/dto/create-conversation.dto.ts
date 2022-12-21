export class CreateConversationDto {
  title: string | null;
  description: string;
  last_message_id: number | null;
  pinned_message_id: number | null;
  author_id: number;
  createdAt: Date;
  updatedAt: Date;
}
