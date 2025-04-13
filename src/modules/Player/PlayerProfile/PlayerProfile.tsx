import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {
  AddUserIcon,
  CoachIcon,
  FlagIcon,
  RemoveUserIcon,
  SettingsIcon,
  TeamIcon,
  UserPlaceholderIcon,
} from '../../../assets/icons';
import {appColors} from '../../../constants/colors';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {Button, FlatList, useColorMode, View} from 'native-base';
import {
  useTextColor,
  useLightTextColor,
  useCardColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../utils/customHooks/storeHooks';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';
import {useGetAvailableSportsQuery} from '../../../store/core/core.service';
import {PulseEffect} from '../../../components/PulseEffect';
import {TabView, SceneMap} from 'react-native-tab-view';
import {
  authApi,
  useGetUserByIdServiceQuery,
} from '../../../store/auth/auth.service';
import {Loader} from '../../../components/Loader';
import {playerLevels} from '../../../constants/player';
import {
  playerApi,
  useFollowPlayerMutation,
  useGetPlayerPostsByPlayerIdServiceQuery,
  useUnfollowPlayerMutation,
} from '../../../store/player/player.service';
import {Toast} from '../../../components/Toast';
import {updateToast} from '../../../store/core/core.slice';
import {ViewPostPage} from '../../Core/ViewPost';

export type PlayerProfilePageRouteProp = RouteProp<
  RootStackParamList,
  'PlayerProfilePage'
>;

const PlayerPosts = () => (
  <View style={{flex: 1, backgroundColor: '#ff4081'}}>
    <Text>
      we have dynamic content inside the tabs. it was working in v2. but the
      height shrinks to 0 with v3. would greatly appreciate any workaround that
      allows ciate any workaround that allows for variable-height content.{' '}
    </Text>
  </View>
);

const PlayerAchievements = () => (
  <View style={{flex: 1, backgroundColor: '#673ab7'}} />
);

const PlayerProfile = () => {
  const {params} = useRoute<PlayerProfilePageRouteProp>();

  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const {user, isLoggedIn, userType} = useAppSelector(state => state.auth);

  const isVisitor = user?.id !== params.userId;
  const {data: sports} = useGetAvailableSportsQuery();
  const {
    data: playerData,
    isLoading: playerDataCIP,
    isFetching: playerDataFIP,
  } = useGetUserByIdServiceQuery(
    {userId: params.userId},
    {
      // refetchOnMountOrArgChange: true,
    },
  );

  const {data: playerPosts} = useGetPlayerPostsByPlayerIdServiceQuery(
    {
      playerId: params.userId,
    },
    {
      // refetchOnMountOrArgChange: true,
    },
  );

  const [followPlayer, {isLoading: followCIP}] = useFollowPlayerMutation();
  const [unfollowPlayer, {isLoading: unfollowCIP}] =
    useUnfollowPlayerMutation();

  const containerShadow = useContainerShadow(4);
  const textColor = useTextColor();
  const lightTextColor = useLightTextColor();
  const cardColor = useCardColor();

  const handleFollow = async () => {
    if (!isLoggedIn) {
      dispatch(
        updateToast({
          isVisible: true,
          message: 'Please login to follow players',
        }),
      );
      return;
    }

    try {
      await followPlayer({playerId: params.userId}).unwrap();

      dispatch(
        authApi.util.updateQueryData(
          'getUserByIdService',
          {userId: params.userId},
          draft => {
            draft.isFollowing = true;
          },
        ),
      );
    } catch (err) {
      console.log('error while following player', err);
    }
  };

  const handleUnFollow = async () => {
    try {
      await unfollowPlayer({playerId: params.userId}).unwrap();
    } catch (err) {
      console.log('error while un-following player', err);
    }
  };

  // const routes = [
  //   {key: 'first', title: 'First'},
  //   {key: 'second', title: 'Second'},
  // ];
  // const layout = useWindowDimensions();
  // const [index, setIndex] = React.useState(0);

  return (
    <PageContainer>
      <GeneralHeader title='Player Profile' />

      {playerDataCIP || playerDataFIP || !playerData?.player ? (
        <Loader />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{marginHorizontal: 16}}>
            <View style={styles.picNameSettings}>
              <View style={styles.picName}>
                <View style={styles.profilePicContainer}>
                  {playerData.profilePicUrl ? (
                    <Image
                      source={{uri: playerData.profilePicUrl}}
                      style={{
                        width: 90,
                        height: 90,
                        objectFit: 'contain',
                        borderRadius: 200,
                      }}
                    />
                  ) : (
                    <UserPlaceholderIcon
                      width={40}
                      height={40}
                      color={textColor}
                    />
                  )}
                </View>
                <View style={{gap: 6}}>
                  <Text style={fontBold(18, textColor)}>
                    {playerData.fullName}
                  </Text>
                  <Text style={fontRegular(14, lightTextColor)}>
                    {playerData.username}
                  </Text>
                </View>
              </View>

              {/* use isFollowing Bit for handling state */}
              {isVisitor ? (
                <PulseEffect>
                  <Button
                    style={{
                      width: playerData.isFollowing ? 82 : 75,
                      height: 32,

                      ...(playerData.isFollowing && {
                        borderWidth: 1,
                        backgroundColor: appColors.transparent,
                        borderColor: appColors.warmRed,
                      }),
                    }}
                    onPress={
                      playerData.isFollowing ? handleUnFollow : handleFollow
                    }
                    isDisabled={followCIP || unfollowCIP}
                    isLoading={followCIP || unfollowCIP}
                    _spinner={{
                      color: unfollowCIP ? appColors.warmRed : appColors.white,
                      size: 'sm',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                      }}>
                      {playerData.isFollowing ? (
                        <>
                          <RemoveUserIcon
                            width={16}
                            height={16}
                            color={appColors.warmRed}
                          />
                          <Text style={[fontRegular(12, appColors.warmRed)]}>
                            Unfollow
                          </Text>
                        </>
                      ) : (
                        <>
                          <AddUserIcon
                            width={16}
                            height={16}
                            color={appColors.white}
                          />
                          <Text style={[fontRegular(12, appColors.white)]}>
                            Follow
                          </Text>
                        </>
                      )}
                    </View>
                  </Button>
                </PulseEffect>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {}}
                  hitSlop={20}
                  style={{}}>
                  <SettingsIcon width={20} height={20} color={textColor} />
                </TouchableOpacity>
              )}
            </View>

            {/* Bio */}
            <View style={styles.bio}>
              <Text style={fontRegular(14, textColor)}>
                {playerData.player?.playerBio}
              </Text>
            </View>

            {/* SPorts */}
            {sports && (
              <View style={styles.interestedSportsContainer}>
                <Text style={fontBold(16, textColor)}>Interested Sports</Text>

                {playerData.player?.primarySport && (
                  <View>
                    <Text
                      style={[fontRegular(14, textColor), styles.primarySport]}>
                      {sports[playerData.player.primarySport]}
                    </Text>
                  </View>
                )}

                {playerData.player?.secondarySports && (
                  <View style={styles.secondarySportsWrapper}>
                    {playerData.player.secondarySports.map(sport => (
                      <Text
                        key={sport}
                        style={[
                          fontRegular(14, appColors.warmRed),
                          styles.secondarySport,
                        ]}>
                        {sports[sport]}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}

            <View style={{marginBottom: 24, gap: 16}}>
              {playerData.player?.playingLevel && (
                <IconTitleName
                  icon={<FlagIcon width={14} height={14} color={textColor} />}
                  title='Player Level : '
                  name={playerLevels[playerData.player.playingLevel]}
                />
              )}
              {playerData.player?.coachName && (
                <IconTitleName
                  icon={<CoachIcon width={14} height={14} color={textColor} />}
                  title='Coach : '
                  name={playerData.player.coachName}
                />
              )}
              {playerData.player?.currentTeam && (
                <IconTitleName
                  icon={<TeamIcon width={14} height={14} color={textColor} />}
                  title='Current Team : '
                  name={playerData.player.currentTeam}
                />
              )}
            </View>
          </View>
          {/* Counts */}
          <View
            style={[
              containerShadow,
              styles.countsContainer,
              {backgroundColor: cardColor},
            ]}>
            <CountTile
              title='Followers'
              count={playerData.player?.followerCount}
            />
            <CountTile title='Posts' count={101} showSeparator />
            <CountTile title='Achievements' count={0} showSeparator={false} />
          </View>

          {playerPosts && (
            <View style={styles.postsContainer}>
              {playerPosts.map((post, index) => (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() =>
                    navigation.navigate(ViewPostPage, {
                      postId: post.id,
                      playerName: playerData.fullName,
                    })
                  }
                  key={post.id}
                  style={styles.postWindow}>
                  <Text>HEllo</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Tab View */}
          {/* <TabView
          style={{minHeight: 200}}
          navigationState={{index, routes}}
          renderScene={SceneMap({
            first: PlayerPosts,
            second: PlayerAchievements,
          })}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        /> */}

          <View style={{height: 40}} />
        </ScrollView>
      )}
    </PageContainer>
  );
};

const IconTitleName = ({
  icon,
  title,
  name,
}: {
  icon: JSX.Element;
  title: string;
  name: string;
}) => {
  const textColor = useTextColor();
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
      <View
        style={{
          width: 26,
          height: 26,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 4,
          backgroundColor: `${appColors.warmRed}40`,
        }}>
        {icon}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
        }}>
        <Text style={fontRegular(14, textColor)}>{title}</Text>
        <Text style={fontBold(14, textColor)}>{name}</Text>
      </View>
    </View>
  );
};

const CountTile = ({
  title,
  count,
  showSeparator = true,
}: {
  title: string;
  count: number;
  showSeparator?: boolean;
}) => {
  const textColor = useTextColor();

  const lightTextColor = useLightTextColor();
  return (
    <View
      style={[
        styles.countTile,
        {
          borderRightWidth: showSeparator ? 1 : 0,
          borderRightColor: `${textColor}30`,
        },
      ]}>
      <Text style={fontRegular(13, textColor)}>{title}</Text>
      <Text style={fontBold(18, textColor)}>{count}</Text>
    </View>
  );
};

export default PlayerProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  picNameSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 20,
  },
  picName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profilePicContainer: {
    width: 90,
    height: 90,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
  bio: {
    marginBottom: 26,
    marginRight: 80,
  },

  countsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 24,
    marginHorizontal: 16,
    // marginTop: 16,
    // gap: 16,
  },

  countTile: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    flex: 1,
  },
  followBtn: {
    paddingVertical: 8,
  },
  primarySport: {
    backgroundColor: `${appColors.warmRed}50`,
    borderRadius: 9,
    alignSelf: 'flex-start',
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginVertical: 16,
  },
  interestedSportsContainer: {
    marginBottom: 26,
  },
  secondarySport: {
    borderWidth: 1,
    borderColor: appColors.warmRed,
    borderRadius: 9,
    alignSelf: 'flex-start',
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  secondarySportsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  postsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    alignItems: 'center',
    rowGap: 9,
    flexWrap: 'wrap',
  },
  postWindow: {
    width: '31.4%', // Adjust based on your requirement
    aspectRatio: 1, // Makes it a square
    backgroundColor: '#add8e6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
