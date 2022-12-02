export interface IConversation {
  id: number;
  title: string;
  description: string;
  last_message_id: number | null;
  createdAt: Date;
  updatedAt: Date;
}
