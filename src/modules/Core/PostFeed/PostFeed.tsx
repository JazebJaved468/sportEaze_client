import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import UserPost from '../../../components/UserPost/UserPost';
import {FlatList, ScrollView} from 'native-base';
import GeneralHeader from '../../../components/GeneralHeader';

export const PostFeed = () => {
  return (
    <PageContainer>
      <GeneralHeader />
      <FlatList data={[1, 2, 3, 4, 5]} renderItem={() => <UserPost />} />
    </PageContainer>
  );
};

const styles = StyleSheet.create({});
