import {FlatList, Image, StyleSheet, Text, TextInput} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import GeneralHeader from '../../../../components/GeneralHeader';
import PageContainer from '../../../../components/PageContainer';
import UserPost from '../../../../components/UserPost/UserPost';
import {Input, useColorModeValue, View} from 'native-base';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Navigator/AppNavigator/AppNavigator';
import {appColors} from '../../../../constants/colors';
import {BackIcon, MessageSendIcon} from '../../../../assets/icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppNavigation} from '../../../../utils/customHooks/navigator';
import {it} from 'date-fns/locale';
import {chatMessagesMockData} from '../../../../constants/mockData/ChatListing';
import {Controller, useForm} from 'react-hook-form';

export type ChatScreenRouteProp = RouteProp<
  RootStackParamList,
  'ChatScreenPage'
>;

export const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();

  const {image, name, isOnline} = route.params;

  const textColor = useColorModeValue(appColors.black, appColors.white);

  const [conversation, setConversation] = useState(chatMessagesMockData);

  return (
    // <PageContainer>
    <View style={{flex: 1}}>
      <ChatScreenHeader image={image} name={name} isOnline={isOnline} />

      <ChatBody conversation={conversation} />
      <ChatScreenFooter setConversation={setConversation} />
    </View>
    // </PageContainer>
  );
};

export type ChatMessageProps = {
  message: string;
  time: string;
  isMyMessage: boolean;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  isMyMessage,
  message,
  time,
}) => {
  const messageColor = isMyMessage ? appColors.white : appColors.black;
  return (
    <View
      style={{
        paddingVertical: 10,
        alignItems: isMyMessage ? 'flex-end' : 'flex-start',
      }}>
      <View
        style={{
          backgroundColor: isMyMessage
            ? appColors.warmRed
            : appColors.whisperGray,
          paddingVertical: 12,
          paddingLeft: 12,
          paddingRight: 20,
          borderRadius: 16,
          maxWidth: '78%',
        }}>
        <Text
          style={{
            color: messageColor,
            fontSize: 14,
          }}>
          {message}
        </Text>
      </View>
    </View>
  );
};

type ChatBodyProps = {
  conversation: ChatMessageProps[];
};

const ChatBody: React.FC<ChatBodyProps> = ({conversation}) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    console.log('changed');
    flatListRef.current?.scrollToEnd({animated: true});
  }, [conversation]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        inverted
        // getItemLayout={(data, index) => ({
        //   length: 70,
        //   offset: 70 * index,
        //   index,
        // })}
        // initialScrollIndex={conversation.length - 1}
        contentContainerStyle={{flexGrow: 1, marginHorizontal: 16}}
        data={conversation}
        // onContentSizeChange={() => {
        //   console.log('scrolling to end');
        //   flatListRef.current?.scrollToEnd({animated: true});
        // }}
        // onLayout={() => flatListRef.current?.scrollToEnd({animated: true})}
        ListFooterComponent={<View style={{height: 30}} />}
        renderItem={({item}) => {
          return (
            <ChatMessage
              message={item.message}
              isMyMessage={item.isMyMessage}
              time={item.time}
            />
          );
        }}
      />
    </View>
  );
};

type ChatScreenFooterProps = {
  // name: string;
  // image: string;
  // isOnline: boolean;
  // flatlistRef: React.RefObject<FlatList>;
  setConversation: React.Dispatch<React.SetStateAction<ChatMessageProps[]>>;
};

const ChatScreenFooter: React.FC<ChatScreenFooterProps> = ({
  setConversation,
  // flatlistRef,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      message: '',
    },
  });

  const onSend = (data: any) => {
    console.log(data);
    setConversation(prev => [
      {
        message: data.message,
        time: '10:17 AM',
        isMyMessage: true,
      },
      ...prev,
    ]);
    setValue('message', '');

    // Ensure scroll happens after FlatList updates
    // setTimeout(() => {
    //   flatlistRef.current?.scrollToEnd({animated: true});
    // }, 100);
  };

  return (
    <View style={styles.chatFooterContainer}>
      <View style={{flex: 1}}>
        <Controller
          name='message'
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder='Write Your Message...'
              borderRadius={8}
              borderColor={appColors.placeHolder}
              _focus={{backgroundColor: appColors.transparent}}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (getValues('message').trim().length) {
            handleSubmit(onSend)();
          }
        }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 16,
            backgroundColor: appColors.warmRed,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MessageSendIcon color={appColors.white} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

type ChatScreenHeaderProps = {
  name: string;
  image: string;
  isOnline: boolean;
};
const ChatScreenHeader: React.FC<ChatScreenHeaderProps> = ({
  name,
  image,
  isOnline,
}) => {
  const navigation = useAppNavigation();
  const textColor = useColorModeValue(appColors.black, appColors.white);
  return (
    <View style={styles.chatHeaderContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <BackIcon color={textColor} />
        </TouchableOpacity>
        <View style={styles.profilePicContainer}>
          {isOnline ? <View style={styles.onlineMark} /> : null}
          <Image
            style={styles.profilePic}
            source={{
              uri: image,
            }}
          />
        </View>
      </View>

      <View style={{flex: 1, gap: 2}}>
        <Text numberOfLines={1} style={[styles.name, {color: textColor}]}>
          {name}
        </Text>

        <Text numberOfLines={1} style={[styles.message, {color: textColor}]}>
          typing..
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  profilePicContainer: {
    width: 52,
    height: 50,
    borderRadius: 100,
    // backgroundColor: appColors.gray,
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
  chatHeaderContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    alignItems: 'center',
    gap: 18,
    paddingVertical: 20,
  },
  chatFooterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    alignItems: 'center',
    gap: 10,
    paddingBottom: 20,
  },
});
