import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SportEazeLogo} from '../../assets/icons';
import {appcolors} from '../../constants/colors';

export const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appcolors.warmRed,
      }}>
      <SportEazeLogo />
    </View>
  );
};

const styles = StyleSheet.create({});
