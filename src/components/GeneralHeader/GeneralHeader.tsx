import {Image, StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';
import {Button, Container, useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';
import {useAppSelector} from '../../utils/customHooks/storeHooks';
import {onLogout} from '../../utils/helpers/auth';
import {useAppNavigation} from '../../utils/customHooks/navigator';
import {RegisterPage} from '../../modules/Core/Auth/Register';
import {LoginPage} from '../../modules/Core/Auth/Login';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {BackIcon, LogoutIcon, UserPlaceholderIcon} from '../../assets/icons';

type GeneralHeaderProps = {
  title?: string;
  showRightElement?: boolean;
  showLeftElement?: boolean;
  rightElement?: ReactNode;
  leftElement?: ReactNode;
  showTitle?: boolean;
  titleAlign?: 'center' | 'left' | 'right';
};

export const GeneralHeader: React.FC<GeneralHeaderProps> = ({
  title = 'SportEaze',
  showRightElement = true,
  showLeftElement = true,
  rightElement,
  leftElement,
  showTitle = true,
  titleAlign = 'center',
}) => {
  const navigation = useAppNavigation();
  const textColor = useColorModeValue(appColors.black, appColors.white);

  const {isLoggedIn, user, userType} = useAppSelector(state => state.auth);

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent:
            titleAlign === 'left'
              ? 'flex-start'
              : titleAlign === 'right'
                ? 'flex-end'
                : 'center',
        },
      ]}>
      <View style={{position: 'absolute', left: 16}}>
        {showLeftElement
          ? (leftElement ?? (
              <View style={{marginRight: 'auto'}}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  hitSlop={20}
                  onPress={() => navigation.goBack()}>
                  <BackIcon color={textColor} width={18} height={18} />
                </TouchableOpacity>
              </View>
            ))
          : null}
      </View>

      {showTitle ? (
        <Text style={[styles.title, {color: textColor}]}>{title}</Text>
      ) : null}

      {/* <Text style={[styles.textStyle, {color: textColor}]}>
        {user?.userType} -
      </Text> */}
      <Text style={[styles.textStyle, {color: textColor, fontSize: 18}]}>
        {user?.username}
      </Text>

      <View style={{position: 'absolute', right: 16}}>
        {showRightElement ? (
          isLoggedIn ? (
            <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
              <TouchableOpacity
                activeOpacity={0.5}
                hitSlop={20}
                onPress={async () => {
                  await onLogout();
                }}>
                <LogoutIcon width={24} height={24} color={textColor} />
              </TouchableOpacity>

              <View
                style={{
                  width: 38,
                  height: 38,
                  backgroundColor: appColors.whisperGray,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  // onPress={() => navigation.navigate(LoginPage)}
                >
                  {user?.profilePicUrl ? (
                    <Image
                      source={{uri: user?.profilePicUrl}}
                      style={{
                        width: 36,
                        height: 36,
                        objectFit: 'contain',
                        borderRadius: 9,
                      }}
                    />
                  ) : (
                    <UserPlaceholderIcon
                      width={22}
                      height={22}
                      color={textColor}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                width: 38,
                height: 38,
                backgroundColor: appColors.whisperGray,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.navigate(RegisterPage)}>
                <UserPlaceholderIcon width={22} height={22} color={textColor} />
              </TouchableOpacity>
            </View>
          )
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  textStyle: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
