export type ToastType = {
  message: string;
  isVisible: boolean;
};

export type UserWindow = {
  id: string;
  profilePicUrl: string;
  fullName: string;
  username: string;
  userType: number;
};

export type PendingConnections = {
  totalConnectionCount: number;
  connections: UserWindow[];
};

export type ChatMessage = {
  id: string;
  content: string;
  senderId: string;
  sentAt: string;
};

export type OnMessageTyping = {
  chatId: string;
  receiverId: string;
  contentLength: number;
  senderId: string;
};

export type Notification = {
  id: string;
  type: number;
  redirect: string;
  data: NotificationData;
};

export type NotificationData = {
  message: string;
  user: UserWindow;
  createdAt: string;
};
