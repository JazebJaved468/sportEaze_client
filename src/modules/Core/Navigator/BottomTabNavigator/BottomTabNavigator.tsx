import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import PlayerProfile, {PlayerProfilePage} from '../../../sample/PlayerProfile';
import PlayerHome, {PlayerHomePage} from '../../../sample/PlayerHome';
import {appcolors} from '../../../../constants/colors';
import PostFeed from '../../PostFeed';

const Tab = createBottomTabNavigator();

const screenOptions: BottomTabNavigationOptions = {
  tabBarActiveTintColor: appcolors.black,
  tabBarInactiveTintColor: `${appcolors.gray}90`,
  headerShown: false,
};

export const FanBottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name='Feed' component={PostFeed} />
      <Tab.Screen name='Events' component={PlayerHome} />
      <Tab.Screen name='Menu' component={PlayerProfile} />
    </Tab.Navigator>
  );
};

export const PlayerBottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name='Feed' component={PostFeed} />
      <Tab.Screen name='Profile' component={PlayerProfile} />
      <Tab.Screen name='Inbox' component={PlayerProfile} />
      <Tab.Screen name='Menu' component={PlayerProfile} />
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
