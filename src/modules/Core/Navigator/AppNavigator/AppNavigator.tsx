import React, {useEffect, useRef} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlayerHome, {PlayerHomePage} from '../../../sample/PlayerHome';
import FanRoot, {FanRootPage} from '../../../Fan/Root';
import PlayerRoot, {PlayerRootPage} from '../../../Player/Root';
import PatronRoot, {PatronRootPage} from '../../../Patron/Root';
import MentorRoot, {MentorRootPage} from '../../../Mentor/Root';
import ChatScreen, {ChatScreenPage} from '../../Chat/ChatScreen';
import CreatePost, {CreatePostPage} from '../../../Player/CreatePost';
import OnBoarding, {OnBoardingPage} from '../../OnBoarding';
import {store} from '../../../../store/store';
import Register, {RegisterPage} from '../../Auth/Register';
import Login, {LoginPage} from '../../Auth/Login';
import {useAppSelector} from '../../../../utils/customHooks/storeHooks';
import {useAppNavigation} from '../../../../utils/customHooks/navigator';
import {useDidUpdateEffect} from '../../../../utils/customHooks/customHooks';
import JoinAs, {JoinAsPage} from '../../Auth/JoinAs';
import FanRegistrationDetails, {
  FanRegistrationDetailsPage,
} from '../../../Fan/FanRegistrationDetails';
import {User} from '../../../../types/auth/auth.type';
import {MediaType, USER_TYPE} from '../../../../constants/enums';
import Gemini from '../../../Fan/Menu/Gemini';
import MediaPreview, {
  MediaPreviewPage,
} from '../../../../components/MediaPreview';
import Recommendations, {
  RecommendationsPage,
} from '../../../Fan/Recommendations';
import NotificationListing, {
  NotificationListingPage,
} from '../../NotificationListing';
import PlayerRegistrationDetails, {
  PlayerRegistrationDetailsPage,
} from '../../../Player/PlayerRegistrationDetails';
import PlayerProfile, {PlayerProfilePage} from '../../../Player/PlayerProfile';
import ViewPost, {ViewPostPage} from '../../ViewPost';
import FanProfile, {FanProfilePage} from '../../../Fan/FanProfile';
import {
  AcceptedConnectionsPage,
  FollowingListingPage,
  PendingConnectionsPage,
} from '../../Networking';
import PendingConnections from '../../Networking/PendingConnections';
import AcceptedConnections from '../../Networking/AcceptedConnections';
import FollowingListing from '../../Networking/FollowingListing';
import MentorRegistrationDetails, {
  MentorRegistrationDetailsPage,
} from '../../../Mentor/MentorRegistrationDetails.tsx';
import AccountSettings, {
  AccountSettingsPage,
} from '../../AccountSettings/index.ts';
import SuperAdminRoot, {
  SuperAdminRootPage,
} from '../../../SuperAdmin/Root/index.ts';
import GDPR, {GDPRPage} from '../../../SuperAdmin/GDPR/index.ts';
import PatronRegistrationDetails from '../../../Patron/PatronRegistrationDetails/PatronRegistrationDetails.tsx';
import {PatronRegistrationDetailsPage} from '../../../Patron/PatronRegistrationDetails/index.ts';
import WaitingforApproval, {
  WaitingforApprovalPage,
} from '../../../Patron/WaitingForApproval/index.ts';
import FollowerListing, {
  FollowerListingPage,
} from '../../../Player/Followerlisting/index.ts';
import PatronRequests, {
  PatronRequestsPage,
} from '../../../SuperAdmin/PatronRequests/index.ts';
import PatronDetailsVerification from '../../../SuperAdmin/PatronDetailsVerification/PatronDetailsVerification.tsx';
import {PatronDetailsVerificationPage} from '../../../SuperAdmin/PatronDetailsVerification/index.ts';
import ContractListing from '../../../Contract/ContractListing/ContractListing.tsx';
import {ContractListingPage} from '../../../Contract/ContractListing/index.ts';
import CreateContract, {
  CreateContractPage,
} from '../../../Patron/CreateContract/index.ts';
import ContractPreview from '../../../Contract/ContractPreview/ContractPreview.tsx';
import {ContractPreviewPage} from '../../../Contract/ContractPreview/index.ts';
import UserPosts, {UserPostsPage} from '../../UserPosts/index.ts';
import Wallet from '../../Wallet/Wallet.tsx';
import {WalletPage} from '../../Wallet/index.ts';
import PlayerComparison, {
  PlayerComparisonPage,
} from '../../../Player/PlayerComparison/index.ts';
import GiveEndorsement, {
  GiveEndorsementPage,
} from '../../../Mentor/GiveEndorsement/index.ts';
import EndorsementListing, {
  EndorsementListingPage,
} from '../../../Player/EndorsementListing/index.ts';
import MentorEndorsementListing, {
  MentorEndorsementListingPage,
} from '../../../Mentor/MentorEndorsementListing/index.ts';
import MentorProfile, {
  MentorProfilePage,
} from '../../../Mentor/MentorProfile/index.ts';
import PatronProfile, {
  PatronProfilePage,
} from '../../../Patron/PatronProfile/index.ts';
import PatronContractListing from '../../../Patron/PatronContractListing/PatronContractListing.tsx';
import {PatronContractListingPage} from '../../../Patron/PatronContractListing/index.ts';
import {
  PrivacyPolicyPage,
  TermsAndConditionsPage,
} from '../../PrivacyPolicy/index.ts';
import {PrivacyPolicy} from '../../PrivacyPolicy/PrivacyPolicy.tsx';
import {TermsAndConditions} from '../../PrivacyPolicy/TermsAndConditions.tsx';

export type RootStackParamList = {
  PlayerHomePage: undefined;
  PlayerProfilePage: {
    userId: string;
  };
  FanProfilePage: {
    userId: string;
  };
  FanRootPage: undefined;
  PlayerRootPage: undefined;
  PatronRootPage: undefined;
  MentorRootPage: undefined;
  ChatScreenPage: {
    receiverId: string;
  };
  CreatePostPage: undefined;
  OnBoardingPage: undefined;
  RegisterPage: undefined;
  LoginPage: undefined;
  JoinAsPage: undefined;
  FanRegistrationDetailsPage: {
    isEditProfile?: boolean;
  };
  GeminiPage: undefined;
  MediaPreviewPage: {
    mediaPath: string;
    mediaType: MediaType;
    onRemove?: () => void;
  };
  RecommendationsPage: undefined;
  NotificationListingPage: undefined;
  PlayerRegistrationDetailsPage: undefined;
  ViewPostPage: {
    postId: string;
    playerName: string;
  };
  PendingConnectionsPage: undefined;
  AcceptedConnectionsPage: undefined;
  FollowingListingPage: undefined;
  MentorRegistrationDetailsPage: {
    isEditProfile?: boolean;
  };
  AccountSettingsPage: undefined;
  SuperAdminRootPage: undefined;
  GDPRPage: undefined;
  PatronRegistrationDetailsPage: {
    isEditProfile?: boolean;
  };
  WaitingforApprovalPage: undefined;
  FollowerListingPage: undefined;
  PatronRequestsPage: undefined;
  PatronDetailsVerificationPage: {
    patronId: string;
  };
  ContractListingPage: {
    userId: string;
  };
  CreateContractPage: {
    playerId: string;
    isEditing: boolean;
    contractId?: string;
  };
  ContractPreviewPage: {
    contractId: string;
  };
  UserPostsPage: {
    userId: string;
    userType: number;
  };
  WalletPage: undefined;
  PlayerComparisonPage: undefined;
  GiveEndorsementPage: {
    playerId: string;
    playerName: string;
    playerImage: string | null;
    playerUsername: string;
  };
  EndorsementListingPage: {
    playerId: string;
  };
  MentorEndorsementListingPage: {
    mentorId: string;
  };
  MentorProfilePage: {
    userId: string;
  };
  PatronProfilePage: {
    userId: string;
  };
  PatronContractListingPage: {
    userId: string;
  };
  PrivacyPolicyPage: undefined;
  TermsAndConditionsPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const getInitialRouteName = (user: User | null, isFirstVisit: boolean) => {
  if (isFirstVisit) {
    return OnBoardingPage;
  }

  if (!user) {
    return FanRootPage;
  }

  if (!user.userType) {
    return JoinAsPage;
  }

  switch (user.userType) {
    case USER_TYPE.FAN:
      return FanRootPage;
    case USER_TYPE.PLAYER:
      return PlayerRootPage;
    case USER_TYPE.PATRON:
      return PatronRootPage;
    case USER_TYPE.MENTOR:
      return MentorRootPage;
    case USER_TYPE.SUPER_ADMIN:
      return SuperAdminRootPage;
    default:
      return FanRootPage;
  }
};

export const AppNavigator = () => {
  const {userType, user, isLoggedIn} = useAppSelector(state => state.auth);
  const {isFirstVisit} = useAppSelector(state => state.core);

  const navigation = useAppNavigation();

  console.log('userType', userType);

  useDidUpdateEffect(() => {
    if (userType === USER_TYPE.GENERAL && isLoggedIn) {
      navigation.reset({
        index: 0,
        routes: [{name: JoinAsPage}],
      });
    } else if (userType === USER_TYPE.FAN) {
      navigation.reset({
        index: 0,
        routes: [{name: FanRootPage}],
      });
    } else if (userType === USER_TYPE.PLAYER) {
      navigation.reset({
        index: 0,
        routes: [{name: PlayerRootPage}],
      });
    } else if (userType === USER_TYPE.PATRON) {
      navigation.reset({
        index: 0,
        routes: [{name: PatronRootPage}],
      });
    } else if (userType === USER_TYPE.MENTOR) {
      navigation.reset({
        index: 0,
        routes: [{name: MentorRootPage}],
      });
    } else if (userType === USER_TYPE.SUPER_ADMIN) {
      navigation.reset({
        index: 0,
        routes: [{name: SuperAdminRootPage}],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: FanRootPage}],
      });
    }
  }, [userType, isLoggedIn]);

  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName(user, isFirstVisit)} //usertype will be coming from backend
      //usertype will be coming from backend
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 200,
      }}>
      {/* Core Screens */}
      <Stack.Screen name={ChatScreenPage} component={ChatScreen} />
      <Stack.Screen name={OnBoardingPage} component={OnBoarding} />
      <Stack.Screen name={RegisterPage} component={Register} />
      <Stack.Screen name={LoginPage} component={Login} />
      <Stack.Screen name={JoinAsPage} component={JoinAs} />
      <Stack.Screen
        name={PendingConnectionsPage}
        component={PendingConnections}
      />
      <Stack.Screen
        name={AcceptedConnectionsPage}
        component={AcceptedConnections}
      />
      <Stack.Screen name={FollowingListingPage} component={FollowingListing} />

      <Stack.Screen
        name={NotificationListingPage}
        component={NotificationListing}
      />
      <Stack.Screen name={ContractListingPage} component={ContractListing} />

      <Stack.Screen
        name={MediaPreviewPage}
        component={MediaPreview}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen name={UserPostsPage} component={UserPosts} />

      <Stack.Screen
        name={ViewPostPage}
        component={ViewPost}
        options={{
          animation: 'fade',
        }}
      />

      <Stack.Screen name={AccountSettingsPage} component={AccountSettings} />
      <Stack.Screen name={WalletPage} component={Wallet} />
      <Stack.Screen name={PrivacyPolicyPage} component={PrivacyPolicy} />
      <Stack.Screen
        name={TermsAndConditionsPage}
        component={TermsAndConditions}
      />

      {/* Fan Screens */}
      <Stack.Screen name={FanRootPage} component={FanRoot} />
      <Stack.Screen
        name={FanRegistrationDetailsPage}
        component={FanRegistrationDetails}
        initialParams={{isEditProfile: false}}
      />
      <Stack.Screen name={'GeminiPage'} component={Gemini} />
      <Stack.Screen name={RecommendationsPage} component={Recommendations} />
      <Stack.Screen name={FanProfilePage} component={FanProfile} />

      {/* Player Screens */}
      <Stack.Screen name={PlayerRootPage} component={PlayerRoot} />
      <Stack.Screen name={CreatePostPage} component={CreatePost} />
      <Stack.Screen
        name={PlayerRegistrationDetailsPage}
        component={PlayerRegistrationDetails}
      />
      <Stack.Screen name={PlayerProfilePage} component={PlayerProfile} />
      <Stack.Screen name={FollowerListingPage} component={FollowerListing} />
      <Stack.Screen
        name={EndorsementListingPage}
        component={EndorsementListing}
      />

      {/* Patron Screens */}
      <Stack.Screen name={PatronRootPage} component={PatronRoot} />
      <Stack.Screen
        name={PatronRegistrationDetailsPage}
        component={PatronRegistrationDetails}
        initialParams={{isEditProfile: false}}
      />
      <Stack.Screen
        name={WaitingforApprovalPage}
        component={WaitingforApproval}
      />
      <Stack.Screen
        name={CreateContractPage}
        component={CreateContract}
        initialParams={{isEditing: false}}
      />
      <Stack.Screen name={ContractPreviewPage} component={ContractPreview} />
      <Stack.Screen name={PatronProfilePage} component={PatronProfile} />
      <Stack.Screen
        name={PatronContractListingPage}
        component={PatronContractListing}
      />

      {/* Mentor Screens */}
      <Stack.Screen name={MentorRootPage} component={MentorRoot} />
      <Stack.Screen
        name={MentorRegistrationDetailsPage}
        component={MentorRegistrationDetails}
        initialParams={{isEditProfile: false}}
      />
      <Stack.Screen name={GiveEndorsementPage} component={GiveEndorsement} />
      <Stack.Screen
        name={MentorEndorsementListingPage}
        component={MentorEndorsementListing}
      />
      <Stack.Screen name={MentorProfilePage} component={MentorProfile} />

      {/* Super Admin Screens */}
      <Stack.Screen name={SuperAdminRootPage} component={SuperAdminRoot} />
      <Stack.Screen name={GDPRPage} component={GDPR} />
      <Stack.Screen name={PatronRequestsPage} component={PatronRequests} />
      <Stack.Screen
        name={PatronDetailsVerificationPage}
        component={PatronDetailsVerification}
      />

      <Stack.Screen name={PlayerComparisonPage} component={PlayerComparison} />

      {/* Samples  */}
      <Stack.Screen name={PlayerHomePage} component={PlayerHome} />
    </Stack.Navigator>
  );
};
