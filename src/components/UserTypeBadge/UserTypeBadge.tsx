import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import React from 'react';
import {appColors} from '../../constants/colors';
import {USER_TYPE} from '../../constants/enums';
import {fontRegular} from '../../styles/fonts';

export const UserTypeBadge = ({
  userType,
  applyConstantWidth = true,
  applyLightOpacityInBackgroudColor = true,
  labelSize = 12,
  labelColor = appColors.white,
}: {
  userType: number;
  applyConstantWidth?: boolean;
  applyLightOpacityInBackgroudColor?: boolean;

  labelSize?: number;
  labelColor?: string;
}) => {
  const getBadgeStyle = (): StyleProp<TextStyle> => {
    return {
      paddingVertical: 4,
      borderRadius: 6,
      textAlign: 'center',
      width: applyConstantWidth ? 60 : undefined,
      paddingHorizontal: applyConstantWidth ? 0 : 8,
      ...fontRegular(labelSize, labelColor),
    };
  };

  switch (userType) {
    case USER_TYPE.PLAYER:
      return (
        <Text
          style={[
            getBadgeStyle(),
            {
              backgroundColor: applyLightOpacityInBackgroudColor
                ? `${appColors.warmRed}90`
                : appColors.warmRed,
            },
          ]}>
          Player
        </Text>
      );
    case USER_TYPE.FAN:
      return (
        <Text
          style={[
            getBadgeStyle(),
            {
              backgroundColor: applyLightOpacityInBackgroudColor
                ? `${appColors.success}90`
                : appColors.success,
            },
          ]}>
          Fan
        </Text>
      );
    case USER_TYPE.PATRON:
      return (
        <Text
          style={[
            getBadgeStyle(),
            {
              backgroundColor: applyLightOpacityInBackgroudColor
                ? `${appColors.gold}90`
                : appColors.gold,
            },
          ]}>
          Patron
        </Text>
      );
    case USER_TYPE.MENTOR:
      return (
        <Text
          style={[
            getBadgeStyle(),
            {
              backgroundColor: applyLightOpacityInBackgroudColor
                ? `${appColors.teal}90`
                : appColors.teal,
            },
          ]}>
          Mentor
        </Text>
      );
    default:
      return (
        <Text
          style={[
            getBadgeStyle(),
            {
              backgroundColor: applyLightOpacityInBackgroudColor
                ? `${appColors.success}90`
                : appColors.success,
            },
          ]}>
          Fan
        </Text>
      );
  }
};

const styles = StyleSheet.create({});
