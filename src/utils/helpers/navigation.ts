import {createNavigationContainerRef} from '@react-navigation/native';
import {PlayerProfilePage} from '../../modules/Player/PlayerProfile';
import {RootStackParamList} from '../../modules/Core/Navigator/AppNavigator/AppNavigator';
import {USER_TYPE} from '../../constants/enums';
import {FanProfilePage} from '../../modules/Fan/FanProfile';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigateToProfilePage = ({
  userId,
  userType,
}: {
  userId: string;
  userType: number | null;
}) => {
  if (navigationRef.isReady()) {
    console.log('Navigating to PlayerProfilePage with userId:', userId);
    if (userType === USER_TYPE.PLAYER) {
      navigationRef.navigate(PlayerProfilePage, {
        userId: userId,
      });
    } else if (userType === USER_TYPE.FAN) {
      navigationRef.navigate(FanProfilePage, {
        userId: userId,
      });
    }
  }
};
