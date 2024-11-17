import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Container, useColorModeValue} from 'native-base';
import {appcolors} from '../../constants/colors';

export const GeneralHeader = () => {
  const textColor = useColorModeValue(appcolors.black, appcolors.white);

  return (
    <View style={styles.container}>
      <Text style={[styles.textStyle, {color: textColor}]}>Sport Eaze</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  textStyle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
