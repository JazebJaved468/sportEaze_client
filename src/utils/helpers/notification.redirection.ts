import {NotificationType} from '../../constants/enums';
import {
  AcceptedConnectionsPage,
  PendingConnectionsPage,
} from '../../modules/Core/Networking';
import {Notification} from '../../types/core/core.type';
import {navigateToProfilePage, navigationRef} from './navigation';

export const handleNotificationRedirection = (notification: Notification) => {
  const {type, data} = notification;

  if (!navigationRef.isReady()) return;

  console.log('Navigating to notification:');
  switch (type) {
    case NotificationType.FOLLOW:
      console.log('-Navigating to follow notification:', data.user);
      navigateToProfilePage({
        userId: data.user.id,
        userType: data.user.userType,
      });
      break;

    case NotificationType.CONNECTION_REQUEST:
      navigationRef.navigate(PendingConnectionsPage);
      break;

    case NotificationType.CONNECTION_ACCEPTED:
      navigationRef.navigate(AcceptedConnectionsPage);
      break;

    default:
      console.warn('Unknown notification type:', type);
  }
};
