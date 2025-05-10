import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppNavigation} from '../../utils/customHooks/navigator';
import {ChatScreenPage} from '../../modules/Core/Chat/ChatScreen';
import SkeletonLoader from '../SkeletonLoader';
import {ChatMessage, UserWindow} from '../../types/core/core.type';
import {format} from 'date-fns';
import {fontLight, fontRegular} from '../../styles/fonts';
import {useTextColor} from '../../utils/customHooks/colorHooks';
import {UserPlaceholderIcon} from '../../assets/icons';
import {customWidth} from '../../styles/responsiveStyles';

export type ChatCardProps = {
  message: ChatMessage;
  unread: boolean;
  isOnline: boolean;
  receiver: UserWindow;
  isTyping?: boolean;
};

export const ChatCard: React.FC<ChatCardProps> = ({
  message,
  isOnline,
  unread,
  receiver,
  isTyping,
}) => {
  const navigation = useAppNavigation();

  const textColor = useTextColor();
  const messageColor = useColorModeValue(
    appColors.placeHolder,
    appColors.white,
  );

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        navigation.navigate(ChatScreenPage, {receiverId: receiver.id});
      }}>
      <View
        style={[
          styles.chatCardContainer,
          {
            borderLeftColor: unread ? appColors.warmRed : `${textColor}40`,

            borderLeftWidth: 4,
            paddingHorizontal: 16,
          },
        ]}>
        <View style={styles.profilePicContainer}>
          {isOnline ? <View style={styles.onlineMark} /> : null}
          {receiver.profilePicUrl ? (
            <Image
              source={{uri: receiver.profilePicUrl}}
              style={{
                width: 52,
                height: 52,
                objectFit: 'contain',
                borderRadius: 100,
              }}
            />
          ) : (
            <UserPlaceholderIcon width={20} height={20} color={textColor} />
          )}
        </View>
        <View style={{flex: 1, gap: 2}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text numberOfLines={1} style={[styles.name, {color: textColor}]}>
              {receiver.fullName}
            </Text>
            <Text style={fontLight(12, textColor)}>
              {format(message.sentAt, 'd MMM y')}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={[
                styles.message,
                fontRegular(12),
                {color: isTyping ? appColors.warmRed : `${textColor}90`},
              ]}>
              {isTyping ? 'Typing . . .' : message.content}
            </Text>
            <Text style={fontLight(12, textColor)}>
              {format(message.sentAt, 'hh:mm aaa')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ChatCardSkeleton = () => {
  return (
    <SkeletonLoader>
      <View
        style={[styles.chatCardContainer, {marginHorizontal: customWidth(16)}]}>
        <View style={styles.profilePicContainer}>
          <View style={styles.profilePic} />
        </View>
        <View style={{flex: 1, gap: 2}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.skeletonName} />
            <View style={styles.skeletonTime} />
          </View>
          <View style={[styles.messageSkeleton]}></View>
        </View>
      </View>
    </SkeletonLoader>
  );
};

const styles = StyleSheet.create({
  chatCardContainer: {
    flexDirection: 'row',
    // marginHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: appColors.divider,
    gap: 18,
    paddingVertical: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  profilePicContainer: {
    width: 52,
    height: 52,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    // overflow: 'hidden',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  skeletonName: {
    width: '70%',
    height: 20,
    borderRadius: 20,
  },
  skeletonTime: {
    width: '10%',
    height: 20,
    borderRadius: 20,
  },
  message: {
    marginRight: 60,
    flex: 1,
  },
  messageSkeleton: {
    marginRight: 60,
  },
  time: {
    fontSize: 12,
    fontWeight: '300',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  onlineMark: {
    width: 12,
    height: 12,
    backgroundColor: appColors.warmRed,
    borderRadius: 100,
    position: 'absolute',
    zIndex: 1,
    right: 0,
    bottom: 4,
  },
});
