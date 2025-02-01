import React, {useEffect, useRef} from 'react';
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
import Register, {RegisterPage} from '../../Auth/Register';
import Login, {LoginPage} from '../../Auth/Login';
import {useAppSelector} from '../../../../utils/customHooks/storeHooks';
import {useAppNavigation} from '../../../../utils/customHooks/navigator';
import {useDidUpdateEffect} from '../../../../utils/customHooks/customHooks';

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
  RegisterPage: undefined;
  LoginPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const getInitialRouteName = (userType: string, isFirstVisit: boolean) => {
  if (isFirstVisit) {
    return OnBoardingPage;
  }

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
  const {userType} = useAppSelector(state => state.auth);
  const {isFirstVisit} = useAppSelector(state => state.core);

  const navigation = useAppNavigation();

  console.log('userType', userType);

  useDidUpdateEffect(() => {
    if (userType === USER_TYPE.FAN) {
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
    }
  }, [userType]);

  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName(userType, isFirstVisit)} //usertype will be coming from backend
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
