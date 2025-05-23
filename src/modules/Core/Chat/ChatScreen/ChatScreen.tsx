import {BackHandler, FlatList, Image, StyleSheet, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PageContainer from '../../../../components/PageContainer';
import {Button, Input, useColorModeValue, View} from 'native-base';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Navigator/AppNavigator/AppNavigator';
import {appColors} from '../../../../constants/colors';
import {
  BackIcon,
  MessageSendIcon,
  UserPlaceholderIcon,
} from '../../../../assets/icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppNavigation} from '../../../../utils/customHooks/navigator';
import {Controller, useForm} from 'react-hook-form';
import {
  useGetChatMessagesQuery,
  useMarkChatAsReadMutation,
} from '../../../../store/core/core.service';
import {Loader} from '../../../../components/Loader';
import {useAppSelector} from '../../../../utils/customHooks/storeHooks';
import {getSocket} from '../../../../store/socket/socket.service';
import {ChatMessage} from '../../../../types/core/core.type';
import {SocketEvents} from '../../../../store/socket/socket.events';
import {AppStates} from '../../../../constants/core';
import PullToRefresh from '../../../../components/PullToRefresh';
import {format} from 'date-fns';
import {fontBold, fontRegular} from '../../../../styles/fonts';
import {customHeight, customWidth} from '../../../../styles/responsiveStyles';
import {PulseEffect} from '../../../../components/PulseEffect';
import {USER_TYPE} from '../../../../constants/enums';
import {ContractListingPage} from '../../../Contract/ContractListing';
import {useTextColor} from '../../../../utils/customHooks/colorHooks';

export type ChatScreenRouteProp = RouteProp<
  RootStackParamList,
  'ChatScreenPage'
>;

const sendStopTypingSocket = (
  chatId: string | undefined,
  receiverId: string,
) => {
  if (chatId) {
    getSocket()?.emit(SocketEvents.IS_MSG_TYPING, {
      chatId: chatId,
      receiverId: receiverId,
      contentLength: 0,
    });
  }
};

export const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();

  const {receiverId} = route.params;

  const {data, isLoading, refetch} = useGetChatMessagesQuery({
    receiverId,
  });

  const textColor = useColorModeValue(appColors.black, appColors.white);

  const [conversation, setConversation] = useState<ChatMessage[]>([]);

  const [markChatAsRead] = useMarkChatAsReadMutation();

  useEffect(() => {
    if (data?.unreadCount && data.chatId && data?.unreadCount > 0) {
      markChatAsRead({chatId: data?.chatId, user2Id: receiverId});
    }
  }, [data?.unreadCount]);

  useEffect(() => {
    if (data) {
      setConversation(data.messages);
    }
  }, [data]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        sendStopTypingSocket(data?.chatId, receiverId);
        return false;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, [data?.chatId, receiverId]);

  const onRefresh = async () => {
    await refetch();
  };

  return (
    <PageContainer>
      <View style={{flex: 1}}>
        {isLoading || !data ? (
          <Loader />
        ) : (
          <>
            <ChatScreenHeader
              image={data?.receiver.profilePicUrl}
              name={data?.receiver.fullName}
              isOnline={true}
              isTyping={data?.isTyping}
              userId={data.receiver.id}
            />
            <ChatBody conversation={conversation} onRefresh={onRefresh} />
            <ChatScreenFooter
              setConversation={setConversation}
              receiverId={receiverId}
              chatId={data?.chatId}
            />
          </>
        )}
      </View>
    </PageContainer>
  );
};

const TextMessage: React.FC<ChatMessage> = ({
  content,
  id,
  senderId,
  sentAt,
}) => {
  const {user} = useAppSelector(state => state.auth);

  const isMyMessage = senderId === user?.id;

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
          paddingRight: 16,
          borderRadius: 18,
          maxWidth: '78%',
          gap: customHeight(10),
          minWidth: customWidth(80),
        }}>
        <Text style={fontRegular(13, messageColor)}>{content}</Text>
        <Text style={[fontRegular(8, messageColor), {alignSelf: 'flex-end'}]}>
          {format(sentAt, 'hh:mm a')}
        </Text>
      </View>
    </View>
  );
};

type ChatBodyProps = {
  conversation: ChatMessage[];
  onRefresh: () => Promise<void>;
};

const ChatBody: React.FC<ChatBodyProps> = ({conversation, onRefresh}) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // console.log('changed');
    flatListRef.current?.scrollToEnd({animated: true});
  }, [conversation]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        windowSize={100}
        scrollEventThrottle={16}
        initialNumToRender={20}
        inverted
        refreshControl={<PullToRefresh onRefresh={onRefresh} />}
        // getItemLayout={(data, index) => ({
        //   length: 70,
        //   offset: 70 * index,
        //   index,
        // })}
        // initialScrollIndex={conversation.length - 1}
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: 16,
          paddingTop: 16,
        }}
        data={conversation}
        // onContentSizeChange={() => {
        //   console.log('scrolling to end');
        //   flatListRef.current?.scrollToEnd({animated: true});
        // }}
        // onLayout={() => flatListRef.current?.scrollToEnd({animated: true})}
        ListFooterComponent={<View style={{height: 30}} />}
        renderItem={({item}) => {
          return (
            <TextMessage
              content={item.content}
              id={item.id}
              senderId={item.senderId}
              sentAt={item.sentAt}
            />
          );
        }}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

type ChatScreenFooterProps = {
  // name: string;
  // image: string;
  // isOnline: boolean;
  // flatlistRef: React.RefObject<FlatList>;
  // sendMessage: (message: string) => void;
  setConversation: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  receiverId: string;
  chatId: string | undefined;
};

const ChatScreenFooter: React.FC<ChatScreenFooterProps> = ({
  setConversation,
  receiverId,
  chatId,
  // sendMessage,
  // flatlistRef,
}) => {
  const {user} = useAppSelector(state => state.auth);
  const {appState} = useAppSelector(state => state.core);
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      message: '',
    },
  });

  const message = watch('message');

  const sendMessage = () => {
    if (!user) {
      return;
    }
    getSocket()?.emit('send_message', {
      recipientId: receiverId,
      content: getValues('message'),
    });

    setConversation(prev => [
      {
        content: getValues('message'),
        sentAt: new Date().toISOString(),
        senderId: user?.id,
        id: Math.random().toString(36).substring(7),
      },
      ...prev,
    ]);

    setValue('message', '');
  };

  const messageLengthGreaterThanZeroSocketSendRef = useRef(false);

  useEffect(() => {
    if (chatId) {
      console.log('message typing', getValues('message').length);
      if (message.length === 0) {
        getSocket()?.emit(SocketEvents.IS_MSG_TYPING, {
          chatId: chatId,
          receiverId: receiverId,
          contentLength: message.length,
        });

        messageLengthGreaterThanZeroSocketSendRef.current = false;
      } else if (
        messageLengthGreaterThanZeroSocketSendRef.current === false &&
        message.length > 0
      ) {
        console.log('sending typing socket');
        getSocket()?.emit(SocketEvents.IS_MSG_TYPING, {
          chatId: chatId,
          receiverId: receiverId,
          contentLength: message.length,
        });
        messageLengthGreaterThanZeroSocketSendRef.current = true;
      }
    }
  }, [message.length, chatId, receiverId]);

  useEffect(() => {
    if (appState === AppStates.BACKGROUND) {
      sendStopTypingSocket(chatId, receiverId);
      messageLengthGreaterThanZeroSocketSendRef.current = false;
    }
  }, [appState]);

  const textColor = useTextColor();

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
              borderRadius={10}
              borderColor={appColors.warmRed}
              outlineColor={appColors.warmRed}
              _focus={{backgroundColor: appColors.transparent}}
              value={value}
              onChangeText={onChange}
              borderWidth={0.6}
              focusOutlineColor={textColor}
            />
          )}
        />
      </View>
      <PulseEffect>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            if (getValues('message').trim().length) {
              handleSubmit(sendMessage)();
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
      </PulseEffect>
    </View>
  );
};

type ChatScreenHeaderProps = {
  name: string;
  image: string;
  isOnline: boolean;
  isTyping?: boolean;
  userId: string;
};
const ChatScreenHeader: React.FC<ChatScreenHeaderProps> = ({
  name,
  image,
  isOnline,
  isTyping,
  userId,
}) => {
  const {userType} = useAppSelector(state => state.auth);
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

          {image ? (
            <Image
              source={{uri: image}}
              style={{
                width: 50,
                height: 50,
                objectFit: 'contain',
                borderRadius: 100,
              }}
            />
          ) : (
            <UserPlaceholderIcon width={20} height={20} color={textColor} />
          )}
        </View>
      </View>

      <View style={{flex: 1, gap: 2}}>
        <Text numberOfLines={1} style={[fontBold(15, textColor)]}>
          {name}
        </Text>

        {isTyping ? (
          <Text numberOfLines={1} style={[styles.message, {color: textColor}]}>
            typing..
          </Text>
        ) : null}
      </View>

      {userType === USER_TYPE.PATRON || userType === USER_TYPE.PLAYER ? (
        <View>
          <PulseEffect>
            <Button
              onPress={() => {
                navigation.navigate(ContractListingPage, {
                  userId,
                });
              }}
              style={{
                backgroundColor: appColors.warmRed,
                borderRadius: 12,
                width: customWidth(74),
                height: customHeight(32),
              }}>
              <Text style={[fontRegular(12, appColors.white)]}>Contracts</Text>
            </Button>
          </PulseEffect>
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  profilePicContainer: {
    width: 52,
    height: 52,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
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
