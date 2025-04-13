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
import {useUnfollowPlayerMutation} from '../../../store/player/player.service';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';

const FollowingListing = () => {
  const {user} = useAppSelector(state => state.auth);
  const {
    data: myFollowings,
    isLoading: myFollowingsCIP,
    isFetching: myFollowingsFIP,
    refetch: refetchMyFollowings,
  } = useGetMyFollowingsQuery({userId: user?.id});

  const textColor = useTextColor();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  const onRefresh = async () => {
    await refetchMyFollowings();
  };

  return (
    <PageContainer>
      <GeneralHeader title='My Followings' showRightElement={false} />

      {myFollowingsCIP || !myFollowings ? (
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
            data={myFollowings ?? []}
            ListHeaderComponent={
              myFollowings.length === 0 ? null : (
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
                  <Text style={[fontRegular(16, textColor)]}>
                    You are following
                    <Text style={fontBold(16, appColors.warmRed)}>
                      {`  ${myFollowings.length}  `}
                    </Text>
                    player(s)
                  </Text>
                </View>
              )
            }
            refreshControl={<PullToRefresh onRefresh={onRefresh} />}
            renderItem={({item, index}) => (
              <FollowedPlayer
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
                  You haven't follow any players yet
                </Text>
                <Text
                  style={[
                    fontRegular(14, textColor),
                    {marginTop: 10, width: '80%', textAlign: 'center'},
                  ]}>
                  {`Discover and connect with players!`}
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

const FollowedPlayer: React.FC<FollowedPlayerProps> = memo(
  ({fullName, profilePicUrl, userId, userType, username}) => {
    const [unfollowPlayer, {isLoading: unfollowCIP}] =
      useUnfollowPlayerMutation();

    const textColor = useTextColor();
    const lightTextColor = useLightTextColor();
    const navigation = useAppNavigation();

    const handleUnFollowPlayer = async () => {
      try {
        await unfollowPlayer({playerId: userId}).unwrap();
      } catch (err) {
        console.log('error while un-following player', err);
      }
    };

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

        <View style={styles.acceptRejectButtonContainer}>
          <PulseEffect>
            <Button
              style={{
                backgroundColor: appColors.transparent,
                borderWidth: 1,
                borderColor: appColors.warmRed,
                height: 30,
                width: 82,
              }}
              onPress={handleUnFollowPlayer}
              isDisabled={unfollowCIP}
              isLoading={unfollowCIP}
              _spinner={{
                color: appColors.warmRed,
                size: 'sm',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}>
                <RemoveUserIcon
                  width={16}
                  height={16}
                  color={appColors.warmRed}
                />
                <Text style={[fontRegular(12, appColors.warmRed)]}>
                  Unfollow
                </Text>
              </View>
            </Button>
          </PulseEffect>
        </View>
      </View>
    );
  },
);

export default FollowingListing;

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
