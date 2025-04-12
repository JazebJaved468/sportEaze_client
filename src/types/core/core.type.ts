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
