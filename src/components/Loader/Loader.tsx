import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import {appColors} from '../../constants/colors';

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size={'large'} color={appColors.warmRed} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({});
