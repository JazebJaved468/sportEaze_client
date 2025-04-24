import {Connection} from '../auth/auth.type';
import {ChatMessage, PendingConnections, UserWindow} from './core.type';

export type AvailableSportsResponse = Record<string, string>;

export type ConnectUserResponse = {
  connection: Connection;
  message: string;
  success: boolean;
};

export type GetPendingConnectionsResponse = {
  requestId: string;
  status: number;
  user: UserWindow;
}[];

export type GetAcceptedConnectionsResponse = {
  connections: PendingConnections;
  success: boolean;
};

export type GetChatMessagesResponse = {
  chatId?: string;
  unreadCount?: number;
  receiver: UserWindow;
  messages: ChatMessage[];
  isTyping?: boolean;
};
export type GetChatListingResponse = {
  chatId: string;
  unreadCount?: number;
  receiver: UserWindow;
  messages: ChatMessage;
  isTyping?: boolean;
};
