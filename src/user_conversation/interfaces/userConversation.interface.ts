export interface IUserConversation {
  id: number;
  user_id: number;
  conversation_id: number;
  mute: boolean;
  block: boolean;
  last_message_id: number;
}

export interface UpdateLastMessage {
  user_id: number;
  conversation_id: number;
  message_id: number;
}
