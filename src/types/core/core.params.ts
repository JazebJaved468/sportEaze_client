export type ConnectUserParams = {
  receiverId: string;
};
export type RespondConnectionRequestParams = {
  requesterId: string;
  action: number;
};

export type MarkChatAsReadParams = {
  chatId: string;
  user2Id: string;
};
