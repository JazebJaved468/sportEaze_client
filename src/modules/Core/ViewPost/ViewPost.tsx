import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../Navigator/AppNavigator/AppNavigator';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import UserPost from '../../../components/UserPost/UserPost';
import {useGetPostByIdServiceQuery} from '../../../store/player/player.service';
import {Loader} from '../../../components/Loader';

export type ViewPostPageRouteProp = RouteProp<
  RootStackParamList,
  'ViewPostPage'
>;

const ViewPost = () => {
  const {params} = useRoute<ViewPostPageRouteProp>();
  console.log('ViewPostPage ------------> Post ID:', params.postId);

  const {
    data: post,
    isLoading: postCIP,
    isFetching: postFIP,
  } = useGetPostByIdServiceQuery({
    postId: params.postId,
  });

  return (
    <PageContainer>
      <GeneralHeader title={`${params.playerName}'s Post`} />

      {postCIP || postFIP || !post ? <Loader /> : <UserPost post={post} />}
    </PageContainer>
  );
};

export default ViewPost;

const styles = StyleSheet.create({});
