import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import {SportEazeLogo, LogoutIcon} from '../../assets/icons';
import {appColors} from '../../constants/colors';
import {RegisterPage} from '../../modules/Core/Auth/Register';
import {fontExtraBold, fontRegular} from '../../styles/fonts';
import {useCardColor, useTextColor} from '../../utils/customHooks/colorHooks';
import {useAppNavigation} from '../../utils/customHooks/navigator';
import {Button} from 'native-base';
import {useContainerShadow} from '../../utils/customHooks/customHooks';
import {PulseEffect} from '../PulseEffect';

type LoginRequiredProps = {
  message?: string;
  customStyles?: ViewStyle;
  applyShadow?: boolean;
};

const LoginRequired: React.FC<LoginRequiredProps> = ({
  message = 'Login to access this feature',
  customStyles = {},
  applyShadow = true,
}) => {
  const textColor = useTextColor();
  const navigation = useAppNavigation();
  const containerShadow = useContainerShadow(6);
  const cardColor = useCardColor();

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          ...customStyles,
        },
      ]}>
      <View
        style={
          applyShadow
            ? [
                containerShadow,
                {
                  paddingVertical: 40,
                  borderRadius: 20,
                  backgroundColor: cardColor,
                  margin: 20,
                },
              ]
            : []
        }>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SportEazeLogo width={100} height={100} color={textColor} />
          <Text style={[fontExtraBold(16, textColor), {marginTop: 10}]}>
            You are not logged in!
          </Text>
          <Text style={[fontRegular(13, textColor), {marginTop: 10}]}>
            {message}
          </Text>
        </View>

        <PulseEffect>
          <Button
            style={{
              backgroundColor: appColors.warmRed,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              height: 42,
              borderRadius: 14,
              marginHorizontal: 50,
            }}
            onPress={() => {
              navigation.navigate(RegisterPage);
            }}>
            <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
              <LogoutIcon width={18} height={18} color={appColors.white} />
              <Text style={fontRegular(16, appColors.white)}>Login</Text>
            </View>
          </Button>
        </PulseEffect>
      </View>
    </View>
  );
};

export default LoginRequired;

const styles = StyleSheet.create({});
