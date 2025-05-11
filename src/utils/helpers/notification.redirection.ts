import {NotificationType} from '../../constants/enums';
import {ContractPreviewPage} from '../../modules/Contract/ContractPreview';
import {ChatScreenPage} from '../../modules/Core/Chat/ChatScreen';
import {
  AcceptedConnectionsPage,
  PendingConnectionsPage,
} from '../../modules/Core/Networking';
import {Notification} from '../../types/core/core.type';
import {navigateToProfilePage, navigationRef} from './navigation';

export const handleNotificationRedirection = (notification: Notification) => {
  const {type, data, redirect} = notification;

  if (!navigationRef.isReady()) return;

  console.log('Navigating to notification:');
  switch (type) {
    case NotificationType.FOLLOW:
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

    case NotificationType.CONTRACT_UPDATED:
      navigationRef.navigate(ContractPreviewPage, {
        contractId: redirect.contractId,
      });
      break;

    case NotificationType.MSG_RECEIVED:
      navigationRef.navigate(ChatScreenPage, {
        receiverId: redirect.senderId,
      });
      break;

    default:
      console.warn('Unknown notification type:', type);
  }
};
