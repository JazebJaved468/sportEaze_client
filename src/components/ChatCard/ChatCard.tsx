import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';

export type ChatCardProps = {
  name: string;
  message: string;
  image: string;
  time: string;
  unread: boolean;
  isOnline: boolean;
};

export const ChatCard: React.FC<ChatCardProps> = ({
  name,
  message,
  time,
  image,
  isOnline,
  unread,
}) => {
  const textColor = useColorModeValue(appColors.black, appColors.white);
  const messageColor = useColorModeValue(
    appColors.placeHolder,
    appColors.white,
  );

  return (
    <View style={styles.chatCardContainer}>
      <View style={styles.profilePicContainer}>
        {isOnline ? <View style={styles.onlineMark} /> : null}
        <Image
          style={styles.profilePic}
          source={{
            uri: image,
          }}
        />
      </View>
      <View style={{flex: 1, gap: 2}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text numberOfLines={1} style={[styles.name, {color: textColor}]}>
            {name}
          </Text>
          <Text style={[styles.time, {color: textColor}]}>{time}</Text>
        </View>
        <Text numberOfLines={1} style={[styles.message, {color: textColor}]}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatCardContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: appColors.divider,
    gap: 18,
    paddingVertical: 20,
  },
  profilePicContainer: {
    width: 52,
    height: 50,
    borderRadius: 100,
    // backgroundColor: appColors.gray,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  message: {
    fontSize: 12,
    fontWeight: '300',
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
