import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import GeneralHeader from '../../../../components/GeneralHeader';
import PageContainer from '../../../../components/PageContainer';
import {chatListingMockData} from '../../../../constants/mockData/ChatListing';
import ChatCard from '../../../../components/ChatCard';
import {ChatCardSkeleton} from '../../../../components/ChatCard/ChatCard';
import {RefreshControl} from 'react-native-gesture-handler';
import {useGetChatListingQuery} from '../../../../store/core/core.service';
import {useAppSelector} from '../../../../utils/customHooks/storeHooks';
import PullToRefresh from '../../../../components/PullToRefresh';
import {LoginRequired} from '../../../../components/LoginRequired';
import {MessageIcon} from '../../../../assets/icons';
import {useTextColor} from '../../../../utils/customHooks/colorHooks';
import {fontBold, fontRegular} from '../../../../styles/fonts';
import {customHeight} from '../../../../styles/responsiveStyles';

export const ChatListing = () => {
  const {user, isLoggedIn} = useAppSelector(state => state.auth);

  const {data, isFetching, isLoading, isError, refetch} =
    useGetChatListingQuery(
      {
        userId: user?.id || '',
      },
      {skip: !user?.id},
    );

  const textColor = useTextColor();

  const onRefresh = async () => {
    await refetch();
  };

  return (
    <PageContainer>
      <GeneralHeader title='Messages' />

      {!isLoggedIn ? (
        <LoginRequired message={'Login to access your profile'} />
      ) : isLoading || !data ? (
        <ChatListingSkeleton />
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={data}
          refreshControl={<PullToRefresh onRefresh={onRefresh} />}
          renderItem={({item}) =>
            isLoading ? (
              <ChatCardSkeleton />
            ) : (
              <ChatCard
                receiver={item.receiver}
                message={item.messages}
                unread={
                  item?.unreadCount && item.unreadCount > 0 ? true : false
                }
                isOnline={true}
                isTyping={item.isTyping}
              />
            )
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MessageIcon
                width={120}
                height={120}
                color={textColor}
                strokeWidth={0.8}
              />
              <Text style={[fontBold(16, textColor), {marginTop: 16}]}>
                You have no messages yet
              </Text>
              <Text
                style={[
                  fontRegular(14, textColor),
                  {marginTop: 10, width: '80%', textAlign: 'center'},
                ]}>
                Start a conversation with someone you know or follow to get
                started.
              </Text>
            </View>
          }
        />
      )}
    </PageContainer>
  );
};

export const ChatListingSkeleton = () => {
  return (
    <>
      <ChatCardSkeleton />
      <ChatCardSkeleton />
      <ChatCardSkeleton />
      <ChatCardSkeleton />
      <ChatCardSkeleton />
      <ChatCardSkeleton />
      <ChatCardSkeleton />
      <ChatCardSkeleton />
      <ChatCardSkeleton />
      <ChatCardSkeleton />
      <ChatCardSkeleton />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexGrow: 1,
    paddingBottom: customHeight(50),
  },
});
