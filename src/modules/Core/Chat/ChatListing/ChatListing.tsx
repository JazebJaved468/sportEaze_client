import {FlatList, Image, StyleSheet, Text} from 'react-native';
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

export const ChatListing = () => {
  const {user} = useAppSelector(state => state.auth);

  const {data, isFetching, isLoading, isError, refetch} =
    useGetChatListingQuery(
      {
        userId: user?.id || '',
      },
      {skip: !user?.id},
    );

  const onRefresh = async () => {
    await refetch();
  };

  return (
    <PageContainer>
      <GeneralHeader title='Messages' />

      {isLoading || !data ? (
        <ChatListingSkeleton />
      ) : (
        <FlatList
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
                unread={true}
                isOnline={true}
                isTyping={item.isTyping}
              />
            )
          }
        />
      )}
    </PageContainer>
  );
};

const ChatListingSkeleton = () => {
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

const styles = StyleSheet.create({});
