import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {memo, useCallback, useEffect} from 'react';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {Controller, useForm, useWatch} from 'react-hook-form';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {
  useCardColor,
  useLightTextColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {
  ExploreIcon,
  UserPlaceholderIcon,
  CrossIcon,
  ComparisonIcon,
} from '../../../assets/icons';
import {View} from 'native-base';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {appColors} from '../../../constants/colors';
import {
  useGetAvailableSportsQuery,
  useGetMatchedMentorsQuery,
  useGetMatchedPatronsQuery,
  useGetRankedPlayerQuery,
  useLazyGetSearchedUsersQuery,
} from '../../../store/core/core.service';
import {USER_TYPE} from '../../../constants/enums';
import {navigateToProfilePage} from '../../../utils/helpers/navigation';
import {UserTypeBadge} from '../../../components/UserTypeBadge';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import PullToRefresh from '../../../components/PullToRefresh';
import {Loader} from '../../../components/Loader';
import {PlayerComparisonPage} from '../../Player/PlayerComparison';

const FanExplore = () => {
  const {user} = useAppSelector(state => state.auth);
  const textColor = useTextColor();

  const [
    getSearchedUsers,
    {
      data: searchedUsers,
      error: searchedUsersError,
      isLoading: searchUsersCIP,
      isFetching: searchUsersFIP,
    },
  ] = useLazyGetSearchedUsersQuery();

  const {
    data: rankedPlayers,
    isLoading: rankedPlayersCIP,
    refetch: refetchRankedPlayers,
  } = useGetRankedPlayerQuery({userId: user?.id ?? ''});

  const {
    data: matchedPatrons,
    isLoading: matchedPatronsCIP,
    refetch: refetchMatchedPatrons,
  } = useGetMatchedPatronsQuery({userId: user?.id ?? ''});
  const {
    data: matchedMentors,
    isLoading: matchedMentorsCIP,
    refetch: refetchMatchedMentors,
  } = useGetMatchedMentorsQuery({userId: user?.id ?? ''});

  const {data: sports} = useGetAvailableSportsQuery();

  const onRefresh = useCallback(async () => {
    await Promise.all([
      refetchRankedPlayers(),
      refetchMatchedMentors(),
      refetchMatchedPatrons(),
    ]);
  }, [refetchRankedPlayers, refetchMatchedMentors, refetchMatchedPatrons]);

  const {
    handleSubmit,
    control,
    formState: {errors},
    setValue,
    getValues,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      search_query: '',
    },
  });

  const searchQuery = useWatch({
    control,
    name: 'search_query',
  });

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        // fetchSearchResults(query);
        try {
          const res = await getSearchedUsers(searchQuery.trim()).unwrap();
          console.log('res:', res);
        } catch (error) {
          console.log('error while searching users:', error);
        }
        // console.log('Call api with - Search Query:', '**', searchQuery);
      }
    }, 500); // 500ms delay before calling API

    return () => clearTimeout(delayDebounce); // Cleanup timeout on each key press
  }, [searchQuery]);

  const containerShadow = useContainerShadow(4);

  const lightTextColor = useLightTextColor();
  const cardColor = useCardColor();

  const navigation = useAppNavigation();

  return (
    <PageContainer>
      <GeneralHeader title='Explore' />

      <FlatList
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshControl={<PullToRefresh onRefresh={onRefresh} />}
        data={[]}
        renderItem={() => <></>}
        ListHeaderComponent={
          <View>
            <View
              style={{marginBottom: customHeight(20), marginHorizontal: 16}}>
              <Controller
                name='search_query'
                control={control}
                rules={{}}
                render={({field: {onChange, onBlur, value}}) => (
                  <CustomTextInputField
                    height={46}
                    borderRadius={14}
                    placeholder='Search for players, fans, patrons, mentors'
                    value={value}
                    onChangeText={onChange}
                    maxLength={50}
                    isValid={true}
                    autoCapitalize='none'
                    rightElement={
                      <View>
                        {searchQuery.length === 0 ? (
                          <View style={{paddingHorizontal: 8}}>
                            <ExploreIcon
                              width={18}
                              height={18}
                              color={textColor}
                            />
                          </View>
                        ) : (
                          <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                              setValue('search_query', '');
                            }}
                            style={styles.cross}>
                            <CrossIcon
                              width={12}
                              height={12}
                              strokeWidth={1.7}
                              color={textColor}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    }
                    customTextInputStyles={{
                      ...fontRegular(13, textColor),
                    }}
                  />
                )}
              />
            </View>

            {
              searchQuery.length > 0 ? (
                // Search Results
                searchUsersCIP || searchUsersFIP ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 10,
                      marginTop: customHeight(140),
                    }}>
                    <ActivityIndicator color={textColor} />
                    <Text style={fontRegular(16, textColor)}>Searching...</Text>
                  </View>
                ) : searchedUsers?.length === 0 &&
                  !(searchUsersCIP || searchUsersFIP) ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',

                      marginTop: customHeight(140),
                    }}>
                    <Text style={fontRegular(16, textColor)}>
                      Sorry, No Users found
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                    style={{
                      paddingHorizontal: customWidth(18),
                      flexGrow: 1,
                      // backgroundColor: 'red',
                    }}
                    data={searchedUsers ?? []}
                    renderItem={({item, index}) => (
                      <UserWindow
                        fullName={item.fullName}
                        profilePicUrl={item.profilePicUrl}
                        userId={item.id}
                        userType={item.userType}
                        username={item.username}
                      />
                    )}
                    keyExtractor={item => item.id.toString()}
                  />
                )
              ) : (
                <>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={[
                      {
                        backgroundColor: cardColor,
                        marginBottom: customHeight(20),
                        height: customHeight(100),
                        marginHorizontal: 16,
                        justifyContent: 'center',
                        borderRadius: 16,
                        overflow: 'hidden',
                      },
                      containerShadow,
                    ]}
                    onPress={() => {
                      navigation.navigate(PlayerComparisonPage);
                    }}>
                    <View
                      style={[
                        {
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: cardColor,
                          gap: 10,
                        },
                      ]}>
                      <ComparisonIcon
                        width={customWidth(32)}
                        height={customWidth(32)}
                        color={appColors.warmRed}
                      />
                      <Text style={fontBold(13, textColor)}>
                        Player Comparison
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {rankedPlayersCIP ||
                  matchedMentorsCIP ||
                  matchedPatronsCIP ? (
                    <View style={{marginTop: '60%'}}>
                      <Loader />
                    </View>
                  ) : (
                    <>
                      {rankedPlayers ? (
                        <View
                          style={{
                            marginBottom: customHeight(20),
                          }}>
                          <Text
                            style={[
                              fontBold(18, textColor),
                              {
                                marginBottom: customHeight(16),
                                marginHorizontal: 16,
                              },
                            ]}>
                            Rising Players
                          </Text>

                          <FlatList
                            refreshControl={
                              <PullToRefresh onRefresh={onRefresh} />
                            }
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps='handled'
                            contentContainerStyle={{
                              paddingHorizontal: 16,
                              gap: 16,
                            }}
                            data={rankedPlayers ?? []}
                            renderItem={({item, index}) => (
                              <UserCard
                                // data={item}
                                count={item.followerCount ?? 0}
                                name={item.fullName}
                                userName={item.username}
                                profilePicUrl={item.profilePicUrl}
                                userId={item.id}
                                userType={item.userType}
                                isPlayer={true}
                                sport={
                                  sports?.[item.player?.primarySport ?? ''] ??
                                  ''
                                }
                              />
                            )}
                            keyExtractor={item => item.id.toString()}
                          />
                        </View>
                      ) : null}

                      {matchedPatrons ? (
                        <View
                          style={{
                            marginBottom: customHeight(20),
                          }}>
                          <Text
                            style={[
                              fontBold(18, textColor),
                              {
                                marginBottom: customHeight(16),
                                marginHorizontal: 16,
                              },
                            ]}>
                            Patrons
                          </Text>

                          <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps='handled'
                            contentContainerStyle={{
                              paddingHorizontal: 16,
                              gap: customWidth(16),
                            }}
                            data={matchedPatrons ?? []}
                            renderItem={({item, index}) => (
                              <UserCard
                                isPatron
                                count={item.patron?.totalContracts ?? 0}
                                name={item.fullName}
                                userName={item.username}
                                profilePicUrl={item.profilePicUrl}
                                userId={item.id}
                                userType={item.userType}
                              />
                            )}
                            keyExtractor={item => item.id.toString()}
                          />
                        </View>
                      ) : null}

                      {matchedMentors ? (
                        <View
                          style={{
                            marginBottom: customHeight(20),
                          }}>
                          <Text
                            style={[
                              fontBold(18, textColor),
                              {
                                marginBottom: customHeight(16),
                                marginHorizontal: 16,
                              },
                            ]}>
                            Mentors
                          </Text>

                          <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps='handled'
                            contentContainerStyle={{
                              paddingHorizontal: 16,
                              gap: customWidth(16),
                            }}
                            data={matchedMentors ?? []}
                            renderItem={({item, index}) => (
                              <UserCard
                                isMentor
                                count={item.connectionCount ?? 0}
                                name={item.fullName}
                                userName={item.username}
                                profilePicUrl={item.profilePicUrl}
                                userId={item.id}
                                userType={item.userType}
                              />
                            )}
                            keyExtractor={item => item.id.toString()}
                          />
                        </View>
                      ) : null}
                    </>
                  )}
                </>
              ) // If Not search results
            }
          </View>
        }
      />
    </PageContainer>
  );
};

const UserCard = ({
  name,
  userName,
  count,
  profilePicUrl,
  userId,
  userType,
  isPlayer = false,
  isPatron = false,
  isMentor = false,
  sport = '',
}: {
  name: string;
  userName: string;
  profilePicUrl: string | null;
  userId: string;
  userType: number | null;
  count: number;
  isPlayer?: boolean;
  isPatron?: boolean;
  isMentor?: boolean;
  sport?: string;
}) => {
  const containerShadow = useContainerShadow();
  const backgroundColor = useCardColor();
  const textColor = useTextColor();
  const navigation = useAppNavigation();

  const getCountLabel = () => {
    if (isPlayer) {
      if (count === 1) {
        return 'Follower';
      }

      return 'Followers';
    } else if (isPatron) {
      if (count === 1) {
        return 'Contract';
      }

      return 'Contracts';
    } else if (isMentor) {
      if (count === 1) {
        return 'Connection';
      }

      return 'Connections';
    }

    return '';
  };

  return (
    <TouchableOpacity
      style={[
        {backgroundColor, borderRadius: 14, marginVertical: customHeight(6)},
        containerShadow,
      ]}
      onPress={() => navigateToProfilePage({userId, userType})}
      activeOpacity={0.6}>
      <View
        style={[
          {
            minWidth: customWidth(160),
            alignSelf: 'flex-start',
            paddingHorizontal: 16,
            paddingVertical: customHeight(18),
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View
          style={{
            width: 80,
            height: 80,
            backgroundColor: appColors.whisperGray,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            overflow: 'hidden',
            marginBottom: customHeight(14),
          }}>
          {profilePicUrl ? (
            <Image
              source={{uri: profilePicUrl}}
              style={{
                width: 80,
                height: 80,
                objectFit: 'contain',
                borderRadius: 9,
              }}
            />
          ) : (
            <UserPlaceholderIcon width={34} height={34} color={textColor} />
          )}
        </View>

        <Text
          style={[fontBold(14, textColor), {marginBottom: customHeight(4)}]}>
          {name}
        </Text>
        <Text
          style={[
            fontRegular(12, `${textColor}90`),
            {marginBottom: customHeight(4)},
          ]}>
          {userName}
        </Text>

        <Text
          style={[
            fontRegular(12, appColors.warmRed),
            {
              borderColor: appColors.warmRed,
              paddingVertical: 4,
              paddingHorizontal: customWidth(8),
              textAlign: 'center',
              // minWidth: customWidth(120),
              marginTop: customHeight(isPlayer ? 0 : 6),
            },
          ]}>
          {`${count} `} {getCountLabel()}
        </Text>

        {isPlayer ? (
          <Text
            style={[
              fontRegular(10, appColors.warmRed),
              {
                marginTop: customHeight(4),
                borderWidth: 1,
                borderRadius: 6,
                borderColor: appColors.warmRed,
                paddingVertical: 4,
                paddingHorizontal: customWidth(10),
                textAlign: 'center',
              },
            ]}>
            {`${sport}`}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

type UserWindowProps = {
  userId: string;
  fullName: string;
  username: string;
  profilePicUrl: string;
  userType: number;
};

const UserWindow: React.FC<UserWindowProps> = memo(
  ({fullName, profilePicUrl, userId, userType, username}) => {
    const textColor = useTextColor();
    const lightTextColor = useLightTextColor();
    const navigation = useAppNavigation();

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          navigateToProfilePage({
            userId,
            userType,
          });
        }}>
        <View style={styles.picAndName}>
          <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            <View style={styles.profilePicContainer}>
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
                <UserPlaceholderIcon width={28} height={28} color={textColor} />
              )}
            </View>
            <View style={{gap: 2}}>
              <Text style={fontRegular(16, textColor)}>{fullName}</Text>
              <Text style={fontRegular(12, lightTextColor)}>{username}</Text>
            </View>
          </View>
          <UserTypeBadge userType={userType} />
        </View>
      </TouchableOpacity>
    );
  },
);
export default FanExplore;

const styles = StyleSheet.create({
  picAndName: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  badge: {
    paddingVertical: 4,
    borderRadius: 6,
    width: 60,
    textAlign: 'center',
  },
});
