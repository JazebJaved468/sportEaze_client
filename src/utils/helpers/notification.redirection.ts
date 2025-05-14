import {NotificationType} from '../../constants/enums';
import {ContractPreviewPage} from '../../modules/Contract/ContractPreview';
import {ChatScreenPage} from '../../modules/Core/Chat/ChatScreen';
import {
  AcceptedConnectionsPage,
  PendingConnectionsPage,
} from '../../modules/Core/Networking';
import {ViewPostPage} from '../../modules/Core/ViewPost';
import {EndorsementListingPage} from '../../modules/Player/EndorsementListing';
import {store} from '../../store/store';
import {Notification} from '../../types/core/core.type';
import {navigateToProfilePage, navigationRef} from './navigation';

export const handleNotificationRedirection = (notification: Notification) => {
  const {type, data, redirect} = notification;

  const user = store.getState().auth.user;

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

    case NotificationType.CONTRACT_ACCEPTED:
      navigationRef.navigate(ContractPreviewPage, {
        contractId: redirect.contractId,
      });
      break;

    case NotificationType.CONTRACT_CREATED:
      navigationRef.navigate(ContractPreviewPage, {
        contractId: redirect.contractId,
      });
      break;

    case NotificationType.MSG_RECEIVED:
      navigationRef.navigate(ChatScreenPage, {
        receiverId: redirect.senderId,
      });
      break;

    case NotificationType.POST_LIKED:
      navigationRef.navigate(ViewPostPage, {
        postId: redirect.postId,
        playerName: user?.fullName ?? '',
      });
      break;

    case NotificationType.POST_COMMENTED:
      navigationRef.navigate(ViewPostPage, {
        postId: redirect.postId,
        playerName: user?.fullName ?? '',
      });
      break;

    case NotificationType.MILESTONE_ACHIEVED:
      navigationRef.navigate(ContractPreviewPage, {
        contractId: redirect.contractId,
      });
      break;
    case NotificationType.FUNDS_RECEIVED:
      navigationRef.navigate(ContractPreviewPage, {
        contractId: redirect.contractId,
      });
      break;
    case NotificationType.FUNDS_RELEASED:
      navigationRef.navigate(ContractPreviewPage, {
        contractId: redirect.contractId,
      });
      break;
    case NotificationType.ENDORSEMENT_RECEIVED:
      navigationRef.navigate(EndorsementListingPage, {
        playerId: redirect.playerId,
      });
      break;

    default:
      console.warn('Unknown notification type:', type);
  }
};
