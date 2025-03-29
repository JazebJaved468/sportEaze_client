import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ImagePlaceholderIcon} from '../../assets/icons';
import {appColors} from '../../constants/colors';

const FallBackPostImage = () => {
  return (
    <View
      style={[
        {
          backgroundColor: appColors.erieBlack,
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: -1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <ImagePlaceholderIcon
        color={`${'white'}10`}
        width={100}
        height={100}
        strokeWidth={0.3}
      />
    </View>
  );
};

export default FallBackPostImage;

const styles = StyleSheet.create({});
