import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';
import {
  useGetAvailableSportsQuery,
  useRemoveConnectionMutation,
  useRequestConnectUserMutation,
  useRespondConnectionRequestMutation,
} from '../../../store/core/core.service';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../utils/customHooks/storeHooks';
import {useGetUserByIdServiceQuery} from '../../../store/auth/auth.service';
import {Button, FavouriteIcon} from 'native-base';
import {
  CoachIcon,
  ConnectionRequestIcon,
  CrossIcon,
  EndorsementIcon,
  FlagIcon,
  FollowingsIcon,
  ImagePlaceholderIcon,
  RemoveUserIcon,
  SettingsIcon,
  TeamIcon,
  TickIcon,
  UserPlaceholderIcon,
} from '../../../assets/icons';
import {Loader} from '../../../components/Loader';
import {PulseEffect} from '../../../components/PulseEffect';
import {appColors} from '../../../constants/colors';
import {
  ConnectionReqResponse,
  ConnectionStatus,
  USER_TYPE,
} from '../../../constants/enums';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {customHeight} from '../../../styles/responsiveStyles';
import {
  useTextColor,
  useLightTextColor,
  useCardColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import GeneralHeader from '../../../components/GeneralHeader';
import {MessageButton} from '../../../components/MessageButton/MessageButton';
import PageContainer from '../../../components/PageContainer';
import {AccountSettingsPage} from '../../Core/AccountSettings';
import {UserPostsPage} from '../../Core/UserPosts';
import {CountTile} from '../../Fan/FanProfile/FanProfile';
import {MentorEndorsementListingPage} from '../MentorEndorsementListing';
import {IconTitleName} from '../../Player/PlayerProfile/PlayerProfile';
import {MentorRoles} from '../../../constants/mentor';
import {updateToast} from '../../../store/core/core.slice';

export type MentorProfilePageRouteProp = RouteProp<
  RootStackParamList,
  'MentorProfilePage'
>;

const MentorProfile = () => {
  const {params} = useRoute<MentorProfilePageRouteProp>();
  const navigation = useAppNavigation();
  const {user, isLoggedIn, userType} = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();

  const isVisitor = user?.id !== params.userId;

  const {data: sports} = useGetAvailableSportsQuery();

  const {
    data: mentorData,
    isLoading: mentorDataCIP,
    isFetching: mentorDataFIP,
  } = useGetUserByIdServiceQuery(
    {userId: params.userId},
    // {refetchOnMountOrArgChange: true},
  );

  const [requestConnection, {isLoading: requestConnectionCIP}] =
    useRequestConnectUserMutation();

  const [removeConnection, {isLoading: removeConnectionCIP}] =
    useRemoveConnectionMutation();

  const [respondConnectionRequest, {isLoading: respondConnectionRequestCIP}] =
    useRespondConnectionRequestMutation();

  const containerShadow = useContainerShadow(4);
  const textColor = useTextColor();
  const lightTextColor = useLightTextColor();
  const cardColor = useCardColor();

  const handleRemoveConnection = async () => {
    handleCancelConnectionRequest();
    try {
    } catch (err) {
      console.log('error while removing connection', err);
    }
  };

  const handleRequestConnection = async () => {
    try {
      await requestConnection({receiverId: mentorData?.id as string}).unwrap();
    } catch (err) {
      console.log('error while adding connection', err);
    }
  };

  const handleRespondConnectionRequest = async (
    action: ConnectionReqResponse,
  ) => {
    try {
      if (mentorData?.id) {
        await respondConnectionRequest({
          requesterId: mentorData?.id,
          action: action,
        }).unwrap();
      }
    } catch (err) {
      console.log('error while adding connection', err);
    }
  };

  const handleCancelConnectionRequest = async () => {
    try {
      if (mentorData?.id) {
        removeConnection({
          connectionId: mentorData?.id,
        }).unwrap();
      }
    } catch (err) {
      console.log('error while canceling connection request ', err);
    }
  };

  const ConnectionActionButtons = () => {
    if (
      mentorData &&
      mentorData.connection.status === ConnectionStatus.REJECTED
    ) {
      return (
        <PulseEffect>
          <Button
            style={{
              width: 82,
              height: 32,
            }}
            onPress={handleRequestConnection}
            isDisabled={requestConnectionCIP}
            isLoading={requestConnectionCIP}
            _spinner={{
              color: appColors.white,
              size: 'sm',
            }}>
            <Text style={[fontRegular(14, appColors.white)]}>{'Connect'}</Text>
          </Button>
        </PulseEffect>
      );
    } else if (
      mentorData &&
      mentorData.connection.status === ConnectionStatus.ACCEPTED
    ) {
      return (
        <View style={styles.acceptRejectButtonContainer}>
          <PulseEffect>
            <Button
              style={{
                backgroundColor: appColors.transparent,
                borderWidth: 1,
                borderColor: appColors.warmRed,
                width: 82,
                height: 32,
              }}
              onPress={handleRemoveConnection}
              isDisabled={removeConnectionCIP}
              isLoading={removeConnectionCIP}
              _spinner={{
                color: appColors.warmRed,
                size: 'sm',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 8,
                  gap: 4,
                }}>
                <RemoveUserIcon
                  width={16}
                  height={16}
                  color={appColors.warmRed}
                />
                <Text style={[fontRegular(12, appColors.warmRed)]}>Remove</Text>
              </View>
            </Button>
          </PulseEffect>
        </View>
      );
    } else if (
      mentorData &&
      mentorData.connection.status === ConnectionStatus.PENDING
    ) {
      if (user && mentorData.connection.receiverId === user.id) {
        return respondConnectionRequestCIP ? (
          <View style={{width: 50, height: 32}}>
            <Loader size={26} />
          </View>
        ) : (
          <View style={styles.acceptRejectButtonContainer}>
            <PulseEffect>
              <Button
                style={{
                  width: 50,
                  height: 32,
                }}
                onPress={() => {
                  handleRespondConnectionRequest(ConnectionReqResponse.ACCEPT);
                }}
                isDisabled={respondConnectionRequestCIP}
                isLoading={respondConnectionRequestCIP}
                _spinner={{
                  color: appColors.white,
                  size: 'sm',
                }}>
                <TickIcon
                  strokeWidth={2}
                  width={14}
                  height={14}
                  color={appColors.white}
                />
              </Button>
            </PulseEffect>
            <PulseEffect>
              <Button
                style={{
                  backgroundColor: appColors.transparent,
                  borderWidth: 1,
                  borderColor: appColors.warmRed,
                  width: 50,
                  height: 32,
                }}
                onPress={() => {
                  handleRespondConnectionRequest(ConnectionReqResponse.REJECT);
                }}
                isDisabled={respondConnectionRequestCIP}
                isLoading={respondConnectionRequestCIP}
                _spinner={{
                  color: appColors.warmRed,
                  size: 'sm',
                }}>
                <CrossIcon
                  width={14}
                  height={14}
                  strokeWidth={2}
                  color={appColors.warmRed}
                />
              </Button>
            </PulseEffect>
          </View>
        );
      } else {
        return (
          <View style={styles.acceptRejectButtonContainer}>
            <View style={styles.pending}>
              <Text style={fontRegular(14, appColors.white)}>Pending</Text>
            </View>
            <PulseEffect>
              <Button
                style={{
                  backgroundColor: appColors.transparent,
                  borderWidth: 1,
                  borderColor: appColors.warmRed,
                  width: 36,
                  height: 32,
                }}
                onPress={handleCancelConnectionRequest}
                isDisabled={removeConnectionCIP}
                isLoading={removeConnectionCIP}
                _spinner={{
                  color: appColors.warmRed,
                  size: 'sm',
                }}>
                <CrossIcon
                  width={10}
                  height={10}
                  strokeWidth={2}
                  color={appColors.warmRed}
                />
              </Button>
            </PulseEffect>
          </View>
        );
      }
    }
  };

  return (
    <PageContainer>
      <GeneralHeader title='Mentor Profile' />

      {mentorDataCIP || mentorDataFIP || !mentorData ? (
        <Loader />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{marginHorizontal: 16}}>
            <View style={styles.picNameSettings}>
              <View style={styles.picName}>
                <View style={styles.profilePicContainer}>
                  {mentorData.profilePicUrl ? (
                    <Image
                      source={{uri: mentorData.profilePicUrl}}
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
                    {mentorData.fullName}
                  </Text>
                  <Text style={fontRegular(14, lightTextColor)}>
                    {mentorData.username}
                  </Text>
                </View>
              </View>

              {userType === USER_TYPE.PLAYER ? null : isVisitor ? (
                <ConnectionActionButtons />
              ) : (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    navigation.navigate(AccountSettingsPage);
                  }}
                  hitSlop={20}
                  style={{}}>
                  <SettingsIcon width={20} height={20} color={textColor} />
                </TouchableOpacity>
              )}
            </View>

            {/* Bio */}
            {mentorData.mentor?.bio ? (
              <View style={styles.bio}>
                <Text style={fontRegular(14, textColor)}>
                  {mentorData.mentor?.bio}
                </Text>
              </View>
            ) : null}

            {/* Send Message */}

            <View style={{}}>
              {isVisitor ? <MessageButton receiverId={mentorData.id} /> : null}
            </View>

            {/* SPorts */}
            {sports && (
              <View style={styles.interestedSportsContainer}>
                <Text
                  style={[
                    fontBold(16, textColor),
                    {marginBottom: 16, marginTop: 10},
                  ]}>
                  Interested Sports
                </Text>

                {mentorData.mentor?.primarySport && (
                  <View>
                    <Text
                      style={[fontRegular(14, textColor), styles.primarySport]}>
                      {sports[mentorData.mentor.primarySport]}
                    </Text>
                  </View>
                )}

                {mentorData.mentor?.sportInterests && (
                  <View style={styles.secondarySportsWrapper}>
                    {mentorData.mentor.sportInterests.map(sport => (
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
          </View>

          <View style={{marginBottom: 24, gap: 16, marginHorizontal: 16}}>
            {mentorData.mentor?.role && (
              <IconTitleName
                icon={<FlagIcon width={14} height={14} color={textColor} />}
                title='Role : '
                name={MentorRoles[mentorData.mentor.role]}
              />
            )}
            {mentorData.mentor?.currentAffiliation && (
              <IconTitleName
                icon={<CoachIcon width={14} height={14} color={textColor} />}
                title='Affiliated With : '
                name={mentorData.mentor.currentAffiliation}
              />
            )}
            {mentorData.mentor?.yearsOfExperience && (
              <IconTitleName
                icon={
                  <FollowingsIcon width={14} height={14} color={textColor} />
                }
                title='Years Of Experience : '
                name={mentorData.mentor.yearsOfExperience ?? 5}
              />
            )}
          </View>

          {/* Counts */}
          <View
            style={[
              containerShadow,
              styles.countsContainer,
              {backgroundColor: cardColor},
            ]}>
            <CountTile
              title='Connections'
              count={mentorData.connectionCount ?? 0}
            />
            <CountTile
              title='Followings'
              count={mentorData.followerCount ?? 0}
              showSeparator={false}
            />
            {/* <CountTile
              title='Posts'
              count={mentorData.sharedPostCount ?? 0}
              showSeparator={false}
            /> */}
          </View>

          <View style={styles.cardsContainer}>
            {/* 1st */}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate(UserPostsPage, {
                  userId: mentorData.id,

                  userType: mentorData.userType as USER_TYPE,
                });
              }}
              style={[
                styles.card,
                {backgroundColor: cardColor},
                containerShadow,
              ]}>
              <ImagePlaceholderIcon
                width={55}
                height={55}
                color={textColor}
                strokeWidth={1.1}
              />
              <Text
                style={[
                  fontBold(16, textColor),
                  {marginTop: customHeight(10)},
                ]}>
                Shared Posts
              </Text>
            </TouchableOpacity>

            {/* 2nd */}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate(MentorEndorsementListingPage, {
                  mentorId: mentorData.id,
                });
              }}
              style={[
                styles.card,
                {backgroundColor: cardColor},
                containerShadow,
              ]}>
              <EndorsementIcon
                width={45}
                height={45}
                color={textColor}
                strokeWidth={1.1}
              />
              <Text
                style={[
                  fontBold(16, textColor),
                  {marginTop: customHeight(10)},
                ]}>
                Endorsements
              </Text>
            </TouchableOpacity>

            {/* 3rd */}

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                try {
                  Linking.openURL(mentorData.mentor?.website ?? '');
                } catch (err) {
                  dispatch(
                    updateToast({
                      isVisible: true,
                      message: 'Sorry! Portfolio link is not working',
                    }),
                  );
                  console.log('error while opening website', err);
                }
              }}
              style={[
                styles.card,

                {backgroundColor: cardColor, width: '100%'},
                containerShadow,
              ]}>
              <ConnectionRequestIcon
                width={45}
                height={45}
                color={textColor}
                strokeWidth={1.1}
              />
              <Text
                style={[
                  fontBold(16, textColor),
                  {marginTop: customHeight(10)},
                ]}>
                Portfolio
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{height: 40}} />
        </ScrollView>
      )}
    </PageContainer>
  );
};

export default MentorProfile;

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
    marginBottom: 16,
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
    // marginTop: 16,
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
  pending: {
    height: 32,
    backgroundColor: `${appColors.warmRed}60`,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  connected: {
    height: 32,
    // backgroundColor: `${appColors.warmRed}30`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.warmRed,

    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  acceptRejectButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    alignItems: 'center',
    rowGap: 9,
    flexWrap: 'wrap',
  },

  card: {
    width: '48%',
    // paddingVertical: customHeight(40),
    height: customHeight(160),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
