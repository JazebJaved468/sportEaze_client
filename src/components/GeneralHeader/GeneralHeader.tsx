import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';
import {useAppSelector} from '../../utils/customHooks/storeHooks';
import {useAppNavigation} from '../../utils/customHooks/navigator';
import {BackIcon, UserPlaceholderIcon} from '../../assets/icons';
import {fontBold} from '../../styles/fonts';
import {NotificationsButton} from '../NotificationsButton';
import {useTextColor} from '../../utils/customHooks/colorHooks';
import {appColors} from '../../constants/colors';
import {customWidth} from '../../styles/responsiveStyles';
import {RegisterPage} from '../../modules/Core/Auth/Register';

type GeneralHeaderProps = {
  title?: string;
  showRightElement?: boolean;
  showLeftElement?: boolean;
  rightElement?: ReactNode;
  leftElement?: ReactNode;
  showTitle?: boolean;
  titleAlign?: 'center' | 'left' | 'right';
  backHandler?: () => void;
};

export const GeneralHeader: React.FC<GeneralHeaderProps> = ({
  title = 'SportEaze',
  showRightElement = true,
  showLeftElement = true,
  rightElement,
  leftElement,
  showTitle = true,
  titleAlign = 'center',
  backHandler,
}) => {
  const navigation = useAppNavigation();
  const textColor = useTextColor();

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
                  onPress={() => {
                    backHandler ? backHandler() : navigation.goBack();
                  }}>
                  <BackIcon color={textColor} width={18} height={18} />
                </TouchableOpacity>
              </View>
            ))
          : null}
      </View>

      {showTitle ? (
        <Text style={[fontBold(20, textColor), styles.title]}>{title}</Text>
      ) : null}

      {/* <Text style={[styles.textStyle, {color: textColor}]}>
        {user?.username} -
      </Text> */}
      <Text style={[styles.textStyle, {color: textColor, fontSize: 18}]}>
        {user?.username}
      </Text>

      <View style={{position: 'absolute', right: 20}}>
        {showRightElement ? (
          rightElement ? (
            rightElement
          ) : isLoggedIn ? (
            <NotificationsButton />
          ) : (
            <TouchableOpacity
              activeOpacity={0.5}
              hitSlop={20}
              onPress={() => {
                navigation.navigate(RegisterPage);
              }}>
              <View style={styles.profilePicContainer}>
                <UserPlaceholderIcon
                  width={customWidth(20)}
                  height={customWidth(20)}
                  color={textColor}
                />
              </View>
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  textStyle: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  title: {
    textAlign: 'center',
  },
  profilePicContainer: {
    width: customWidth(36),
    height: customWidth(36),
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
