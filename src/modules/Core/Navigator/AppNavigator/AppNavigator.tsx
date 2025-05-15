import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlayerHome, {PlayerHomePage} from '../../../sample/PlayerHome';
import PlayerProfile, {PlayerProfilePage} from '../../../sample/PlayerProfile';
import FanRoot, {FanRootPage} from '../../../Fan/Root';
import {USER_TYPE} from '../../../../types/user/user';
import PlayerRoot, {PlayerRootPage} from '../../../Player/Root';
import PatronRoot, {PatronRootPage} from '../../../Patron/Root';
import MentorRoot, {MentorRootPage} from '../../../Mentor/Root';
import ChatScreen, {ChatScreenPage} from '../../Chat/ChatScreen';
import CreatePost, {CreatePostPage} from '../../../Player/CreatePost';
import OnBoarding, {OnBoardingPage} from '../../OnBoarding';
import {store} from '../../../../store/store';

export type RootStackParamList = {
  PlayerHomePage: undefined;
  PlayerProfilePage: undefined;
  FanRootPage: undefined;
  PlayerRootPage: undefined;
  PatronRootPage: undefined;
  MentorRootPage: undefined;
  ChatScreenPage: {
    name: string;
    image: string;
    isOnline: boolean;
  };
  CreatePostPage: undefined;
  OnBoardingPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const getInitialRouteName = ({userType}: {userType: string}) => {
  const {isFirstVisit} = store.getState().core;

  // if (isFirstVisit) {
  //   return OnBoardingPage;
  // }

  switch (userType) {
    case USER_TYPE.FAN:
      return FanRootPage;
    case USER_TYPE.PLAYER:
      return PlayerRootPage;
    case USER_TYPE.PATRON:
      return PatronRootPage;
    case USER_TYPE.MENTOR:
      return MentorRootPage;
    default:
      return FanRootPage;
  }
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName({userType: USER_TYPE.PATRON})} //usertype will be coming from backend
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 200,
      }}>
      {/* Core Screens */}
      <Stack.Screen name={ChatScreenPage} component={ChatScreen} />
      <Stack.Screen name={OnBoardingPage} component={OnBoarding} />

      {/* Fan Screens */}
      <Stack.Screen name={FanRootPage} component={FanRoot} />

      {/* Player Screens */}
      <Stack.Screen name={PlayerRootPage} component={PlayerRoot} />
      <Stack.Screen name={CreatePostPage} component={CreatePost} />

      {/* Patron Screens */}
      <Stack.Screen name={PatronRootPage} component={PatronRoot} />

      {/* Mentor Screens */}
      <Stack.Screen name={MentorRootPage} component={MentorRoot} />

      {/* Samples  */}
      <Stack.Screen name={PlayerHomePage} component={PlayerHome} />
      <Stack.Screen name={PlayerProfilePage} component={PlayerProfile} />
    </Stack.Navigator>
  );
};
