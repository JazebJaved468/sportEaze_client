import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Container, useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';

type GeneralHeaderProps = {
  title?: string;
};

export const GeneralHeader: React.FC<GeneralHeaderProps> = ({
  title = 'SportEaze',
}) => {
  const textColor = useColorModeValue(appColors.black, appColors.white);

  return (
    <View style={styles.container}>
      <Text style={[styles.textStyle, {color: textColor}]}>{title}</Text>
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
