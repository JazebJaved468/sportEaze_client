import {coreApi} from '../../store/core/core.service';
import {store} from '../../store/store';

const dispatch = store.dispatch;

export const onNotificationsRead = () => {
  dispatch(
    coreApi.util.updateQueryData(
      'getNotifications',
      {userId: store.getState()?.auth?.user?.id || ''},
      draft => {
        draft.unreadCount = 0;
      },
    ),
  );
};
