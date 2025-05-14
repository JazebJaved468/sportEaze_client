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
  RemoveUserIcon,
  TickIcon,
  CrossIcon,
  CoachIcon,
  ConnectionRequestIcon,
  EndorsementIcon,
  FlagIcon,
  FollowingsIcon,
  ImagePlaceholderIcon,
  SettingsIcon,
  UserPlaceholderIcon,
  IndustryIcon,
} from '../../../assets/icons';
import {Loader} from '../../../components/Loader';
import {PulseEffect} from '../../../components/PulseEffect';
import {appColors} from '../../../constants/colors';
import {
  ConnectionReqResponse,
  ConnectionStatus,
  USER_TYPE,
} from '../../../constants/enums';
import {useGetUserByIdServiceQuery} from '../../../store/auth/auth.service';
import {
  useGetAvailableSportsQuery,
  useRequestConnectUserMutation,
  useRemoveConnectionMutation,
  useRespondConnectionRequestMutation,
} from '../../../store/core/core.service';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {
  useTextColor,
  useLightTextColor,
  useCardColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {
  useAppSelector,
  useAppDispatch,
} from '../../../utils/customHooks/storeHooks';
import {MentorProfilePageRouteProp} from '../../Mentor/MentorProfile/MentorProfile';
import {Button} from 'native-base';
import {customHeight} from '../../../styles/responsiveStyles';
import GeneralHeader from '../../../components/GeneralHeader';
import {MessageButton} from '../../../components/MessageButton/MessageButton';
import PageContainer from '../../../components/PageContainer';
import {updateToast} from '../../../store/core/core.slice';
import {AccountSettingsPage} from '../../Core/AccountSettings';
import {UserPostsPage} from '../../Core/UserPosts';
import {CountTile} from '../../Fan/FanProfile/FanProfile';
import {MentorEndorsementListingPage} from '../../Mentor/MentorEndorsementListing';
import {IconTitleName} from '../../Player/PlayerProfile/PlayerProfile';
import {formatPlayerLevels} from '../../../constants/player';

export type PatronProfilePageRouteProp = RouteProp<
  RootStackParamList,
  'PatronProfilePage'
>;

const PatronProfile = () => {
  const {params} = useRoute<MentorProfilePageRouteProp>();
  const navigation = useAppNavigation();
  const {user, isLoggedIn, userType} = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();

  const isVisitor = user?.id !== params.userId;

  const {data: sports} = useGetAvailableSportsQuery();

  const {
    data: patronData,
    isLoading: patronDataCIP,
    isFetching: patronDataFIP,
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
      await requestConnection({receiverId: patronData?.id as string}).unwrap();
    } catch (err) {
      console.log('error while adding connection', err);
    }
  };

  const handleRespondConnectionRequest = async (
    action: ConnectionReqResponse,
  ) => {
    try {
      if (patronData?.id) {
        await respondConnectionRequest({
          requesterId: patronData?.id,
          action: action,
        }).unwrap();
      }
    } catch (err) {
      console.log('error while adding connection', err);
    }
  };

  const handleCancelConnectionRequest = async () => {
    try {
      if (patronData?.id) {
        removeConnection({
          connectionId: patronData?.id,
        }).unwrap();
      }
    } catch (err) {
      console.log('error while canceling connection request ', err);
    }
  };

  const ConnectionActionButtons = () => {
    if (
      patronData &&
      patronData.connection.status === ConnectionStatus.REJECTED
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
      patronData &&
      patronData.connection.status === ConnectionStatus.ACCEPTED
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
      patronData &&
      patronData.connection.status === ConnectionStatus.PENDING
    ) {
      if (user && patronData.connection.receiverId === user.id) {
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

  console.log('patronData', patronData);

  return (
    <PageContainer>
      <GeneralHeader title='Patron Profile' />

      {patronDataCIP || patronDataFIP || !patronData ? (
        <Loader />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{marginHorizontal: 16}}>
            <View style={styles.picNameSettings}>
              <View style={styles.picName}>
                <View style={styles.profilePicContainer}>
                  {patronData.profilePicUrl ? (
                    <Image
                      source={{uri: patronData.profilePicUrl}}
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
                    {patronData.fullName}
                  </Text>
                  <Text style={fontRegular(14, lightTextColor)}>
                    {patronData.username}
                  </Text>
                </View>
              </View>

              {userType === USER_TYPE.MENTOR ? null : isVisitor ? (
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
            {/* {patronData.patron?.bio ? (
              <View style={styles.bio}>
                <Text style={fontRegular(14, textColor)}>
                  {patronData.patron?.bio}
                </Text>
              </View>
            ) : null} */}

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

                {patronData.patron?.supportedSports && (
                  <View style={styles.secondarySportsWrapper}>
                    {patronData.patron.supportedSports.map(sport => (
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

          {/* Send Message */}

          <View style={{marginHorizontal: 16}}>
            {isVisitor ? <MessageButton receiverId={patronData.id} /> : null}
          </View>

          <View style={{marginBottom: 24, gap: 16, marginHorizontal: 16}}>
            {patronData.patron?.industryType && (
              <IconTitleName
                icon={<IndustryIcon width={14} height={14} color={textColor} />}
                title='Industry : '
                name={patronData.patron.industryType}
              />
            )}
            {patronData.patron?.preferredPlayerLevels && (
              <IconTitleName
                icon={<FlagIcon width={14} height={14} color={textColor} />}
                title='Preferred Players : '
                name={formatPlayerLevels(
                  patronData.patron.preferredPlayerLevels,
                )}
              />
            )}
            {/* {patronData.patron?.yearsOfExperience && (
              <IconTitleName
                icon={
                  <FollowingsIcon width={14} height={14} color={textColor} />
                }
                title='Years Of Experience : '
                name={patronData.patron.yearsOfExperience ?? 5}
              />
            )} */}
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
              count={patronData.connectionCount ?? 0}
            />
            <CountTile
              title='Followings'
              count={patronData.followerCount ?? 0}
            />
            <CountTile
              title='Contracts'
              count={patronData.patron?.totalContracts ?? 0}
              showSeparator={false}
            />
          </View>

          <View style={styles.cardsContainer}>
            {/* 1st */}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate(UserPostsPage, {
                  userId: patronData.id,

                  userType: patronData.userType as USER_TYPE,
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

            {/* 3rd */}

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                try {
                  Linking.openURL(patronData.patron?.website ?? '');
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

                {backgroundColor: cardColor},
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

export default PatronProfile;

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
