import {Notification} from '../../types/core/core.type';

export type ConnectionRequestReceived = {};
export type ConnectionResponseReceived = {
  createdAt: string;
  receiverId: string;
  receiver_id: string;
  requester_id: string;
  senderId: string;
  status: number;
  updatedAt: string;
};

export type NotificationResponse = {
  notifications: Notification[];
  unreadCount: number;
};
