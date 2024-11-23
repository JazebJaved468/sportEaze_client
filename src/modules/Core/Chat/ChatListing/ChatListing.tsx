import {FlatList, Image, StyleSheet, Text} from 'react-native';
import React from 'react';
import GeneralHeader from '../../../../components/GeneralHeader';
import PageContainer from '../../../../components/PageContainer';
import {chatListingMockData} from '../../../../constants/mockData/ChatListing';
import ChatCard from '../../../../components/ChatCard';

export const ChatListing = () => {
  return (
    <PageContainer>
      <GeneralHeader title='Messages' />
      <FlatList
        data={chatListingMockData}
        renderItem={({item}) => (
          <ChatCard
            name={item.name}
            message={item.message}
            image={item.image}
            time={item.time}
            unread={item.unread}
            isOnline={item.isOnline}
          />
        )}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({});
