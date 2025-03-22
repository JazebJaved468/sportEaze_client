import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {NotificationsIcon} from '../../assets/icons';
import {useTextColor} from '../../utils/customHooks/colorHooks';
import {useAppNavigation} from '../../utils/customHooks/navigator';
import {fontBold, fontExtraBold, fontRegular} from '../../styles/fonts';
import {appColors} from '../../constants/colors';
import {NotificationListingPage} from '../../modules/Core/NotificationListing';
import {useAppSelector} from '../../utils/customHooks/storeHooks';

const NotificationsButton = () => {
  const textColor = useTextColor();
  const navigation = useAppNavigation();

  const {isLoggedIn} = useAppSelector(state => state.auth);
  const unreadCount = 2;
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      hitSlop={20}
      style={styles.container}
      onPress={() => navigation.navigate(NotificationListingPage)}>
      {!isLoggedIn || unreadCount <= 0 ? null : (
        <View style={styles.unreadCountContainer}>
          <Text style={fontRegular(9, appColors.white)}>{unreadCount}</Text>
        </View>
      )}
      <NotificationsIcon color={textColor} width={26} height={26} />
    </TouchableOpacity>
  );
};

export default NotificationsButton;

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  unreadCountContainer: {
    position: 'absolute',
    right: 1,
    top: 5,
    width: 15,
    height: 15,
    borderRadius: 16,
    backgroundColor: appColors.warmRed,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
