import {NotificationType, USER_TYPE} from '../../constants/enums';
import {User} from '../../types/auth/auth.type';
import {Wallet} from '../../types/player/player.type';
import {onContractNotificationReceived} from '../../utils/helpers/contract.utils';
import {updateEndorsementListings} from '../../utils/helpers/patron.utils';
import {authApi} from '../auth/auth.service';
import {
  updatePatronWallet,
  updatePlayer,
  updatePlayerWallet,
} from '../auth/auth.slice';
import {coreApi} from '../core/core.service';
import {updateToast} from '../core/core.slice';
import {store} from '../store';
import {superAdminApi} from '../superAdmin/superAdmin.service';
import {
  ConnectionRequestReceived,
  ConnectionResponseReceived,
  NotificationResponse,
} from './socket.type';

const dispatch = store.dispatch;

const {user, userType} = store.getState().auth;

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
    data.notifications[0].type === NotificationType.CONTRACT_UPDATED ||
    data.notifications[0].type === NotificationType.MILESTONE_ACHIEVED ||
    data.notifications[0].type === NotificationType.FUNDS_RELEASED ||
    data.notifications[0].type === NotificationType.FUNDS_RECEIVED
  ) {
    onContractNotificationReceived();
  }

  if (data.notifications[0].type === NotificationType.ENDORSEMENT_RECEIVED) {
    updateEndorsementListings();
  }
};

export const onWalletUpdated = (data: Wallet) => {
  if (userType === USER_TYPE.PATRON) {
    dispatch(updatePatronWallet({wallet: data}));
  } else if (userType === USER_TYPE.PLAYER) {
    dispatch(updatePlayerWallet({wallet: data}));
  }
};

export const onPatronUpdate = (data: User) => {
  console.log('patron data in func');
  // dispatch(
  //   superAdminApi.util.updateQueryData(
  //     'getPatronRequests',
  //     undefined,
  //     draft => {
  //       console.log('patron data in draft', draft);
  //       const index = draft.findIndex(item => item.id === data.id);
  //       if (index !== -1) {
  //         console.log('patron data in draft', draft[index]);
  //         draft[index] = data;
  //       }
  //     },
  //   ),
  // );
};
