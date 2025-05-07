import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo} from 'react';
import {
  useGetMyFollowingsQuery,
  useGetPendingConnectionsQuery,
  useRemoveConnectionMutation,
} from '../../../store/core/core.service';
import {
  useCardColor,
  useLightTextColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';
import PageContainer from '../../../components/PageContainer';
import {
  ConnectionRequestIcon,
  FollowingsIcon,
  RemoveUserIcon,
  UserPlaceholderIcon,
} from '../../../assets/icons';
import GeneralHeader from '../../../components/GeneralHeader';
import {Loader} from '../../../components/Loader';
import PullToRefresh from '../../../components/PullToRefresh';
import {appColors} from '../../../constants/colors';
import {fontRegular, fontBold} from '../../../styles/fonts';
import {PulseEffect} from '../../../components/PulseEffect';
import {UserTypeBadge} from '../../../components/UserTypeBadge';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {navigateToProfilePage} from '../../../utils/helpers/navigation';
import {Button} from 'native-base';
import {
  useGetMyFollowersQuery,
  useUnfollowPlayerMutation,
} from '../../../store/player/player.service';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';

const FollowerListing = () => {
  const {user, userType} = useAppSelector(state => state.auth);
  const {
    data: myFollowers,
    isLoading: myFollowersCIP,
    refetch: refetchMyFollowers,
  } = useGetMyFollowersQuery({userId: user?.id});

  const textColor = useTextColor();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  const onRefresh = async () => {
    await refetchMyFollowers();
  };

  return (
    <PageContainer>
      <GeneralHeader title='My Followers' showRightElement={false} />

      {myFollowersCIP || !myFollowers ? (
        <Loader />
      ) : (
        <>
          <FlatList
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={[
              {
                paddingHorizontal: 20,
                flexGrow: 1,
                gap: 26,
                paddingBottom: 50,
              },
            ]}
            data={myFollowers.followers ?? []}
            ListHeaderComponent={
              myFollowers.followers.length === 0 ? null : (
                <View
                  style={[
                    {
                      marginTop: 16,
                      marginBottom: 4,
                      backgroundColor: cardColor,
                      padding: 16,
                      borderRadius: 16,
                    },
                    containerShadow,
                  ]}>
                  <Text style={[fontRegular(15, textColor)]}>
                    <Text style={fontBold(15, appColors.warmRed)}>
                      {`  ${myFollowers.count}  `}
                    </Text>
                    people are following and supporting you
                  </Text>
                </View>
              )
            }
            refreshControl={<PullToRefresh onRefresh={onRefresh} />}
            renderItem={({item, index}) => (
              <Follower
                userId={item.id}
                fullName={item.fullName}
                username={item.username}
                profilePicUrl={item.profilePicUrl}
                userType={item.userType}
              />
            )}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FollowingsIcon
                  width={120}
                  height={120}
                  color={textColor}
                  strokeWidth={0.8}
                />
                <Text style={[fontBold(16, textColor), {marginTop: 16}]}>
                  You have no followers yet
                </Text>
                <Text
                  style={[
                    fontRegular(14, textColor),
                    {marginTop: 10, width: '80%', textAlign: 'center'},
                  ]}>
                  {`Create and share content to get discovered by fans, sponsors, and mentors.!`}
                </Text>
              </View>
            }
          />
        </>
      )}
    </PageContainer>
  );
};

type FollowedPlayerProps = {
  userId: string;
  fullName: string;
  username: string;
  profilePicUrl: string | null;
  userType: number;
};

const Follower: React.FC<FollowedPlayerProps> = memo(
  ({fullName, profilePicUrl, userId, userType, username}) => {
    const textColor = useTextColor();
    const lightTextColor = useLightTextColor();

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigateToProfilePage({
              userId,
              userType,
            });
          }}>
          <View style={styles.picAndName}>
            <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
              <View style={{alignItems: 'center', paddingBottom: 4}}>
                <View style={[styles.profilePicContainer]}>
                  {profilePicUrl ? (
                    <Image
                      source={{uri: profilePicUrl}}
                      style={{
                        width: 46,
                        height: 46,
                        objectFit: 'contain',
                        borderRadius: 9,
                      }}
                    />
                  ) : (
                    <UserPlaceholderIcon
                      width={28}
                      height={28}
                      color={textColor}
                    />
                  )}
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    zIndex: 1,
                  }}>
                  <UserTypeBadge
                    userType={userType}
                    labelSize={10}
                    applyConstantWidth={false}
                    applyLightOpacityInBackgroudColor={false}
                  />
                </View>
              </View>

              <View style={{gap: 2}}>
                <Text style={fontRegular(16, textColor)}>{fullName}</Text>
                <Text style={fontRegular(12, lightTextColor)}>{username}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
);

export default FollowerListing;

const styles = StyleSheet.create({
  picAndName: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 20,
    // marginHorizontal: 16,
    justifyContent: 'space-between',
  },
  profilePicContainer: {
    width: 46,
    height: 46,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
  cross: {
    width: 30,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  acceptRejectButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
