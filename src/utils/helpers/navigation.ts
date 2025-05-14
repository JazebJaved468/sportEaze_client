import {createNavigationContainerRef} from '@react-navigation/native';
import {PlayerProfilePage} from '../../modules/Player/PlayerProfile';
import {RootStackParamList} from '../../modules/Core/Navigator/AppNavigator/AppNavigator';
import {USER_TYPE} from '../../constants/enums';
import {FanProfilePage} from '../../modules/Fan/FanProfile';
import {PlayerRegistrationDetailsPage} from '../../modules/Player/PlayerRegistrationDetails';
import {FanRegistrationDetailsPage} from '../../modules/Fan/FanRegistrationDetails';
import {MentorProfilePage} from '../../modules/Mentor/MentorProfile';
import {MentorRegistrationDetailsPage} from '../../modules/Mentor/MentorRegistrationDetails.tsx';
import {PatronProfilePage} from '../../modules/Patron/PatronProfile/index.ts';
import {PatronRegistrationDetailsPage} from '../../modules/Patron/PatronRegistrationDetails/index.ts';

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
    } else if (userType === USER_TYPE.MENTOR) {
      navigationRef.navigate(MentorProfilePage, {
        userId: userId,
      });
    } else if (userType === USER_TYPE.PATRON) {
      navigationRef.navigate(PatronProfilePage, {
        userId: userId,
      });
    }
  }
};

export const navigateToEditProfilePage = ({userType}: {userType: number}) => {
  if (navigationRef.isReady()) {
    if (userType === USER_TYPE.PLAYER) {
      navigationRef.navigate(PlayerRegistrationDetailsPage);
    } else if (userType === USER_TYPE.FAN) {
      navigationRef.navigate(FanRegistrationDetailsPage, {isEditProfile: true});
    } else if (userType === USER_TYPE.MENTOR) {
      navigationRef.navigate(MentorRegistrationDetailsPage, {
        isEditProfile: true,
      });
    } else if (userType === USER_TYPE.PATRON) {
      navigationRef.navigate(PatronRegistrationDetailsPage, {
        isEditProfile: true,
      });
    }
  }
};
