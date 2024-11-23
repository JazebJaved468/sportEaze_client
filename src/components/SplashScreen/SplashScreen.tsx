import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SportEazeLogo} from '../../assets/icons';
import {appColors} from '../../constants/colors';

export const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appColors.warmRed,
      }}>
      <SportEazeLogo />
    </View>
  );
};

const styles = StyleSheet.create({});
