import {NotificationType} from '../../constants/enums';
import {onContractNotificationReceived} from '../../utils/helpers/contract.utils';
import {authApi} from '../auth/auth.service';
import {coreApi} from '../core/core.service';
import {updateToast} from '../core/core.slice';
import {store} from '../store';
import {
  ConnectionRequestReceived,
  ConnectionResponseReceived,
  NotificationResponse,
} from './socket.type';

const dispatch = store.dispatch;

export const onConnectionRequestReceived = (
  data: ConnectionRequestReceived,
) => {
  dispatch(coreApi.util.invalidateTags(['PendingConnections']));
};

export const onConnectionResponseReceived = (
  data: ConnectionResponseReceived,
) => {
  dispatch(
    authApi.util.updateQueryData(
      'getUserByIdService',
      {userId: data.receiverId},
      draft => {
        draft.connection = {
          ...draft.connection,
          status: data.status,
        };
      },
    ),
  );
};

export const onNotificationReceived = (data: NotificationResponse) => {
  dispatch(
    updateToast({
      isVisible: true,
      message: data.notifications[0].data.message,
    }),
  );
  dispatch(
    coreApi.util.updateQueryData(
      'getNotifications',
      {userId: store.getState().auth.user?.id || ''},
      draft => {
        draft.unreadCount = data.unreadCount;
        draft.notifications.unshift(data.notifications[0]);
      },
    ),
  );

  if (
    data.notifications[0].type === NotificationType.CONTRACT_CREATED ||
    data.notifications[0].type === NotificationType.CONTRACT_ACCEPTED ||
    data.notifications[0].type === NotificationType.CONTRACT_UPDATED
  ) {
    onContractNotificationReceived();
  }
};
