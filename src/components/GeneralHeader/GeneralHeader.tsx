import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button, Container, useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';
import {useAppSelector} from '../../utils/customHooks/storeHooks';
import {onLogout} from '../../utils/customHooks/helpers/auth';
import {useAppNavigation} from '../../utils/customHooks/navigator';
import {RegisterPage} from '../../modules/Core/Auth/Register';
import {LoginPage} from '../../modules/Core/Auth/Login';

type GeneralHeaderProps = {
  title?: string;
};

export const GeneralHeader: React.FC<GeneralHeaderProps> = ({
  title = 'SportEaze',
}) => {
  const navigation = useAppNavigation();
  const textColor = useColorModeValue(appColors.black, appColors.white);

  const {isLoggedIn, user, userType} = useAppSelector(state => state.auth);

  return (
    <View style={styles.container}>
      <Text style={[styles.textStyle, {color: textColor}]}>
        {user?.userType} -
      </Text>
      <Text style={[styles.textStyle, {color: textColor, fontSize: 18}]}>
        {user?.email}
      </Text>
      {isLoggedIn ? (
        <Button
          onPress={async () => {
            await onLogout();
          }}>
          Logout
        </Button>
      ) : (
        <View style={{flexDirection: 'row', gap: 10}}>
          <Button
            onPress={() => {
              navigation.navigate(RegisterPage);
            }}>
            <Text>Register</Text>
          </Button>
          <Button
            onPress={() => {
              navigation.navigate(LoginPage);
            }}>
            <Text>Login</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },

  textStyle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
