import {StyleSheet, Text, View} from 'react-native';

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlayerHome, {PlayerHomePage} from '../../../Player/PlayerHome';
import PlayerProfile, {PlayerProfilePage} from '../../../Player/PlayerProfile';

export type RootStackParamList = {
  PlayerHomePage: undefined;
  PlayerProfilePage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name={PlayerHomePage} component={PlayerHome} />
      <Stack.Screen name={PlayerProfilePage} component={PlayerProfile} />
    </Stack.Navigator>
  );
};
