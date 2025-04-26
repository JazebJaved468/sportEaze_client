import {coreApi} from '../../store/core/core.service';
import {store} from '../../store/store';
import {GetChatListingResponse} from '../../types/core/core.response';
import {OnMessageTyping} from '../../types/core/core.type';

const dispatch = store.dispatch;
const userId = store.getState().auth.user?.id || '';

export const onMessageSent = (data: GetChatListingResponse) => {
  dispatch(
    coreApi.util.updateQueryData('getChatListing', {userId}, draft => {
      const index = draft.findIndex(item => item.chatId === data.chatId);
      if (index !== -1) {
        // removing the founded chat from the list
        draft.splice(index, 1);
        draft.unshift(data);
      } else {
        draft.unshift(data);
      }
    }),
  );

  dispatch(
    coreApi.util.updateQueryData(
      'getChatMessages',
      {receiverId: data.receiver.id},
      draft => {
        draft.chatId = data.chatId;
        draft.messages.unshift(data.messages);
      },
    ),
  );
};

export const onMessageRecieved = (data: GetChatListingResponse) => {
  onMessageSent(data);

  dispatch(
    coreApi.util.updateQueryData('getChatListing', {userId}, draft => {
      const index = draft.findIndex(item => item.chatId === data.chatId);
      if (index !== -1) {
        draft[index].unreadCount = data.unreadCount;
      }
    }),
  );
};

export const onMessageTyping = (data: OnMessageTyping) => {
  dispatch(
    coreApi.util.updateQueryData('getChatListing', {userId}, draft => {
      const index = draft.findIndex(item => item.chatId === data.chatId);
      if (index !== -1) {
        // removing the founded chat from the list
        draft[index] = {
          ...draft[index],
          isTyping: data.contentLength > 0 ? true : false,
        };
      }
    }),
  );

  dispatch(
    coreApi.util.updateQueryData(
      'getChatMessages',
      {receiverId: data.senderId},

      draft => {
        draft.isTyping = data.contentLength > 0 ? true : false;
      },
    ),
  );
};

export const onChatRead = (chatId: string, user2Id: string) => {
  dispatch(
    coreApi.util.updateQueryData('getChatListing', {userId}, draft => {
      const index = draft.findIndex(item => item.chatId === chatId);
      if (index !== -1) {
        draft[index].unreadCount = 0;
      }
    }),
  );

  dispatch(
    coreApi.util.updateQueryData(
      'getChatMessages',
      {receiverId: user2Id},
      draft => {
        draft.unreadCount = 0;
      },
    ),
  );
};
