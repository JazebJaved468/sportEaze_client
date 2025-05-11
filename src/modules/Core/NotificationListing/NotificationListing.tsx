import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';
import {LoginRequired} from '../../../components/LoginRequired';
import {
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} from '../../../store/core/core.service';
import {ChatListingSkeleton} from '../Chat/ChatListing/ChatListing';
import PullToRefresh from '../../../components/PullToRefresh';
import {
  useCardColor,
  useLightTextColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {Notification} from '../../../types/core/core.type';
import {format} from 'date-fns';
import {NotificationsIcon, UserPlaceholderIcon} from '../../../assets/icons';
import {appColors} from '../../../constants/colors';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {handleNotificationRedirection} from '../../../utils/helpers/notification.redirection';

const NotificationListing = () => {
  const {isLoggedIn, user} = useAppSelector(state => state.auth);

  const {
    data: notifications,
    isLoading,
    refetch,
  } = useGetNotificationsQuery({userId: user?.id || ''}, {skip: !isLoggedIn});

  const [markNotificationsAsRead] = useMarkNotificationsAsReadMutation();

  const onRefresh = async () => {
    await refetch();
  };

  useEffect(() => {
    if (notifications?.unreadCount && notifications.unreadCount > 0) {
      markNotificationsAsRead();
    }
  }, []);

  const textColor = useTextColor();
  return (
    <PageContainer>
      <GeneralHeader title='Notifications' showRightElement={false} />

      {isLoggedIn ? (
        isLoading || !notifications ? (
          <ChatListingSkeleton />
        ) : (
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,

              paddingBottom: customHeight(50),
            }}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={notifications.notifications}
            refreshControl={<PullToRefresh onRefresh={onRefresh} />}
            renderItem={({item}) => {
              return <NotificationCard notificationData={item} />;
            }}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: customWidth(16),
                }}>
                <NotificationsIcon
                  width={120}
                  height={120}
                  color={textColor}
                  strokeWidth={0.8}
                />
                <Text style={[fontBold(16, textColor), {marginTop: 16}]}>
                  No Notifications Yet
                </Text>
                <Text
                  style={[
                    fontRegular(14, textColor),
                    {marginTop: 10, width: '80%', textAlign: 'center'},
                  ]}>
                  We’ll let you know when there’s something new.
                </Text>
              </View>
            }
          />
        )
      ) : (
        <LoginRequired
          message={'Login to access your personalized notifications'}
          customStyles={{
            marginTop: -70,
          }}
        />
      )}
    </PageContainer>
  );
};

const removeUsernameFromMessageIfExist = (
  prefix: string,
  input: string,
): string | null => {
  if (input.startsWith(prefix)) {
    return input.slice(prefix.length);
  } else {
    return null;
  }
};

const NotificationCard = ({
  notificationData,
}: {
  notificationData: Notification;
}) => {
  const textColor = useTextColor();
  const lightTextColor = useLightTextColor();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  const transformedNotificationMessage = removeUsernameFromMessageIfExist(
    notificationData.data.user.fullName,
    notificationData.data.message,
  );

  return (
    <View
      style={[styles.picName, {backgroundColor: cardColor}, containerShadow]}>
      <TouchableOpacity
        onPress={() => {
          handleNotificationRedirection(notificationData);
        }}
        activeOpacity={0.6}
        style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
        <View style={[styles.profilePicContainer]}>
          {notificationData.data.user.profilePicUrl ? (
            <Image
              source={{uri: notificationData.data.user.profilePicUrl}}
              style={{
                width: 40,
                height: 40,
                objectFit: 'contain',
                borderRadius: 200,
              }}
            />
          ) : (
            <UserPlaceholderIcon width={22} height={22} color={textColor} />
          )}
        </View>

        {transformedNotificationMessage === null ? (
          <Text style={[fontRegular(13, textColor), {flex: 1, marginRight: 8}]}>
            {notificationData.data.message}
          </Text>
        ) : (
          <Text style={[fontRegular(13, textColor), {flex: 1, marginRight: 8}]}>
            <Text style={[fontBold(13, textColor)]}>
              {notificationData.data.user.fullName}
            </Text>
            {transformedNotificationMessage}
          </Text>
        )}

        <Text style={[fontRegular(9, lightTextColor), {marginLeft: 'auto'}]}>
          {format(notificationData.data.createdAt, 'MMM d, h:mm aaa')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationListing;

const styles = StyleSheet.create({
  picName: {
    paddingVertical: customHeight(14),
    paddingHorizontal: 16,
    marginHorizontal: customWidth(16),
    marginVertical: customHeight(8),
    borderRadius: 12,
  },
  profilePicContainer: {
    width: 40,
    height: 40,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
});
