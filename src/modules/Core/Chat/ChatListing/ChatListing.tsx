import {FlatList, Image, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import GeneralHeader from '../../../../components/GeneralHeader';
import PageContainer from '../../../../components/PageContainer';
import {chatListingMockData} from '../../../../constants/mockData/ChatListing';
import ChatCard from '../../../../components/ChatCard';
import {ChatCardSkeleton} from '../../../../components/ChatCard/ChatCard';
import {RefreshControl} from 'react-native-gesture-handler';

export const ChatListing = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refereshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsLoading(false);
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <PageContainer>
      <GeneralHeader title='Messages' />
      <FlatList
        data={chatListingMockData}
        refreshControl={
          <RefreshControl refreshing={refereshing} onRefresh={onRefresh} />
        }
        renderItem={({item}) =>
          isLoading ? (
            <ChatCardSkeleton />
          ) : (
            <ChatCard
              name={item.name}
              message={item.message}
              image={item.image}
              time={item.time}
              unread={item.unread}
              isOnline={item.isOnline}
            />
          )
        }
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({});
