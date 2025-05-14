import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {
  CrossIcon,
  ImagePlaceholderIcon,
  RemoveUserIcon,
  SettingsIcon,
  TickIcon,
  UserPlaceholderIcon,
} from '../../../assets/icons';
import {appColors} from '../../../constants/colors';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {Button, View} from 'native-base';
import {
  useTextColor,
  useLightTextColor,
  useCardColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';
import {
  useGetAvailableSportsQuery,
  useRemoveConnectionMutation,
  useRequestConnectUserMutation,
  useRespondConnectionRequestMutation,
} from '../../../store/core/core.service';
import {PulseEffect} from '../../../components/PulseEffect';
import {useGetUserByIdServiceQuery} from '../../../store/auth/auth.service';
import {Loader} from '../../../components/Loader';
import {
  ConnectionReqResponse,
  ConnectionStatus,
  USER_TYPE,
} from '../../../constants/enums';
import {MessageButton} from '../../../components/MessageButton/MessageButton';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {AccountSettingsPage} from '../../Core/AccountSettings';
import {customHeight} from '../../../styles/responsiveStyles';
import {UserPostsPage} from '../../Core/UserPosts';

export type PlayerProfilePageRouteProp = RouteProp<
  RootStackParamList,
  'PlayerProfilePage'
>;

export const FanProfile = () => {
  const {params} = useRoute<PlayerProfilePageRouteProp>();
  const navigation = useAppNavigation();
  const {user, isLoggedIn, userType} = useAppSelector(state => state.auth);

  const isVisitor = user?.id !== params.userId;

  const {data: sports} = useGetAvailableSportsQuery();

  const {
    data: fanData,
    isLoading: fanDataCIP,
    isFetching: fanDataFIP,
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
      await requestConnection({receiverId: fanData?.id as string}).unwrap();
    } catch (err) {
      console.log('error while adding connection', err);
    }
  };

  const handleRespondConnectionRequest = async (
    action: ConnectionReqResponse,
  ) => {
    try {
      if (fanData?.id) {
        await respondConnectionRequest({
          requesterId: fanData?.id,
          action: action,
        }).unwrap();
      }
    } catch (err) {
      console.log('error while adding connection', err);
    }
  };

  const handleCancelConnectionRequest = async () => {
    try {
      if (fanData?.id) {
        removeConnection({
          connectionId: fanData?.id,
        }).unwrap();
      }
    } catch (err) {
      console.log('error while canceling connection request ', err);
    }
  };

  const ConnectionActionButtons = () => {
    if (fanData && fanData.connection.status === ConnectionStatus.REJECTED) {
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
      fanData &&
      fanData.connection.status === ConnectionStatus.ACCEPTED
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
      fanData &&
      fanData.connection.status === ConnectionStatus.PENDING
    ) {
      if (user && fanData.connection.receiverId === user.id) {
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
      <GeneralHeader title='Fan Profile' />

      {fanDataCIP || fanDataFIP || !fanData ? (
        <Loader />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{marginHorizontal: 16}}>
            <View style={styles.picNameSettings}>
              <View style={styles.picName}>
                <View style={styles.profilePicContainer}>
                  {fanData.profilePicUrl ? (
                    <Image
                      source={{uri: fanData.profilePicUrl}}
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
                    {fanData.fullName}
                  </Text>
                  <Text style={fontRegular(14, lightTextColor)}>
                    {fanData.username}
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

            {/* SPorts */}
            {sports && (
              <View style={styles.interestedSportsContainer}>
                <Text style={fontBold(16, textColor)}>Interested Sports</Text>

                {fanData.sportInterests && (
                  <View style={styles.secondarySportsWrapper}>
                    {fanData.sportInterests.map(sport => (
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
            {isVisitor ? <MessageButton receiverId={fanData.id} /> : null}
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
              count={fanData.connectionCount ?? 0}
            />
            <CountTile title='Followings' count={fanData.followerCount ?? 0} />
            <CountTile
              title='Posts'
              count={fanData.sharedPostCount ?? 0}
              showSeparator={false}
            />
          </View>

          <View style={styles.cardsContainer}>
            {/* 1st */}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate(UserPostsPage, {
                  userId: fanData.id,

                  userType: fanData.userType as USER_TYPE,
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
          </View>

          <View style={{height: 40}} />
        </ScrollView>
      )}
    </PageContainer>
  );
};

export const CountTile = ({
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
    marginTop: 16,
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
    width: '100%',
    // paddingVertical: customHeight(40),
    height: customHeight(160),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
