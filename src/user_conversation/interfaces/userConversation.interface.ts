export interface IUserConversation {
  id: number;
  user_id: number;
  conversation_id: number;
  mute: boolean;
  block: boolean;
}

export interface UpdateLastMessage {
  user_id: number;
  conversation_id: number;
  message_id: number;
}
