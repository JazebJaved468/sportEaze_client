import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import PlayerProfile from '../../../sample/PlayerProfile';
import {appColors} from '../../../../constants/colors';
import PostFeed from '../../PostFeed';
import FanMenu from '../../../Fan/Menu';
import ChatListing from '../../Chat/ChatListing';
import CreatePost from '../../../Player/CreatePost';

const Tab = createBottomTabNavigator();

const screenOptions: BottomTabNavigationOptions = {
  tabBarActiveTintColor: appColors.black,
  tabBarInactiveTintColor: `${appColors.gray}90`,
  headerShown: false,
};

export const FanBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      // initialRouteName='Events'
      // backBehavior={'initialRoute'}
    >
      <Tab.Screen name='Feed' component={PostFeed} />
      <Tab.Screen name='Messages' component={ChatListing} />
      <Tab.Screen name='Menu' component={FanMenu} />
    </Tab.Navigator>
  );
};

export const PlayerBottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name='Feed' component={PostFeed} />
      <Tab.Screen name='Profile' component={PlayerProfile} />
      <Tab.Screen name='Inbox' component={PlayerProfile} />
      <Tab.Screen name='Create' component={CreatePost} />
    </Tab.Navigator>
  );
};

export const PatronBottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name='Feed' component={PostFeed} />
      <Tab.Screen name='Players' component={PlayerProfile} />
      <Tab.Screen name='Inbox' component={PlayerProfile} />
      <Tab.Screen name='Menu' component={PlayerProfile} />
    </Tab.Navigator>
  );
};

export const MentorBottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name='Feed' component={PostFeed} />
      <Tab.Screen name='Inbox' component={PlayerProfile} />
      <Tab.Screen name='Menu' component={PlayerProfile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});
