import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {appColors} from '../../constants/colors';
import {fontLight, fontRegular} from '../../styles/fonts';

const ErrorMessage = ({message}: {message: string}) => {
  return (
    <Text style={[fontRegular(10, appColors.error), {paddingVertical: 5}]}>
      {message}
    </Text>
  );
};

export default ErrorMessage;

const styles = StyleSheet.create({});
