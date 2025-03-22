import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SportEazeLogo, LogoutIcon} from '../../assets/icons';
import {appColors} from '../../constants/colors';
import {RegisterPage} from '../../modules/Core/Auth/Register';
import {fontExtraBold, fontRegular} from '../../styles/fonts';
import {useTextColor} from '../../utils/customHooks/colorHooks';
import {useAppNavigation} from '../../utils/customHooks/navigator';
import {Button} from 'native-base';

const LoginRequired = () => {
  const textColor = useTextColor();
  const navigation = useAppNavigation();
  return (
    <View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <SportEazeLogo width={100} height={100} color={textColor} />
        <Text style={[fontExtraBold(16, textColor), {marginTop: 10}]}>
          You are not logged in!
        </Text>
        <Text style={[fontRegular(13, textColor), {marginTop: 10}]}>
          Login to access your profile
        </Text>
      </View>

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
    </View>
  );
};

export default LoginRequired;

const styles = StyleSheet.create({});
