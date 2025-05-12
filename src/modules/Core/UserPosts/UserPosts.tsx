import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useGetPlayerPostsByPlayerIdServiceQuery} from '../../../store/player/player.service';
import {RootStackParamList} from '../Navigator/AppNavigator/AppNavigator';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {Loader} from '../../../components/Loader';
import PullToRefresh from '../../../components/PullToRefresh';
import UserPost from '../../../components/UserPost/UserPost';
import {USER_TYPE} from '../../../constants/enums';
import {ImagePlaceholderIcon} from '../../../assets/icons';
import {useTextColor} from '../../../utils/customHooks/colorHooks';
import {fontBold, fontRegular} from '../../../styles/fonts';

export type UserPostsPageRouteProp = RouteProp<
  RootStackParamList,
  'UserPostsPage'
>;

const UserPosts = () => {
  const {params} = useRoute<UserPostsPageRouteProp>();
  const {
    data: playerPosts,
    isLoading: playerPostsCIP,
    refetch,
  } = useGetPlayerPostsByPlayerIdServiceQuery(
    {
      playerId: params.userId,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const onRefresh = async () => {
    await refetch();
  };

  const textColor = useTextColor();

  return (
    <PageContainer>
      <GeneralHeader
        title={`${params.userType === USER_TYPE.PLAYER ? 'Posts' : 'Shared Posts'}`}
      />

      {playerPostsCIP ? (
        <Loader />
      ) : (
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          scrollEventThrottle={16}
          data={playerPosts}
          refreshControl={<PullToRefresh onRefresh={onRefresh} />}
          keyExtractor={item => `${item.id}-${item.sharedId}`}
          renderItem={({item}) => {
            return <UserPost post={item} />;
          }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImagePlaceholderIcon
                width={120}
                height={120}
                color={textColor}
                strokeWidth={0.6}
              />
              <Text style={[fontBold(16, textColor), {marginTop: 16}]}>
                No Posts Yet
              </Text>
              <Text
                style={[
                  fontRegular(14, textColor),
                  {marginTop: 10, width: '80%', textAlign: 'center'},
                ]}>
                {params.userType === USER_TYPE.PLAYER
                  ? 'This player has not posted anything yet.'
                  : `This user has not shared any posts yet.`}
              </Text>
            </View>
          }
        />
      )}
    </PageContainer>
  );
};

export default UserPosts;

const styles = StyleSheet.create({});
