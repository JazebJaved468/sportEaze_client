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
  useGetPendingConnectionsQuery,
  useRespondConnectionRequestMutation,
} from '../../../store/core/core.service';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {Loader} from '../../../components/Loader';
import {
  useCardColor,
  useLightTextColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {
  ConnectionRequestIcon,
  CrossIcon,
  TickIcon,
  UserPlaceholderIcon,
} from '../../../assets/icons';
import {appColors} from '../../../constants/colors';
import {ConnectionReqResponse} from '../../../constants/enums';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {navigateToProfilePage} from '../../../utils/helpers/navigation';
import PullToRefresh from '../../../components/PullToRefresh';
import {UserTypeBadge} from '../../../components/UserTypeBadge';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';
import {PulseEffect} from '../../../components/PulseEffect';
import {Button} from 'native-base';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';

const PendingConnections = () => {
  const {user} = useAppSelector(state => state.auth);
  const {
    data: pendingConnections,
    isLoading: pendingConnectionsCIP,
    isFetching: pendingConnectionsFIP,
    refetch: refetchPendingConnectionRequests,
  } = useGetPendingConnectionsQuery({userId: user?.id});

  const textColor = useTextColor();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  const onRefresh = async () => {
    await refetchPendingConnectionRequests();
  };
  return (
    <PageContainer>
      <GeneralHeader title='My Connection Requests' showRightElement={false} />

      {pendingConnectionsCIP || !pendingConnections ? (
        <Loader />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{
            paddingHorizontal: 16,
            flexGrow: 1,
            gap: 26,
            paddingBottom: 50,
          }}
          data={pendingConnections ?? []}
          ListHeaderComponent={
            pendingConnections.length === 0 ? null : (
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
                  <Text style={fontBold(16, appColors.warmRed)}>
                    {` ${pendingConnections.length}   `}
                  </Text>
                  New Connection Request (s)
                </Text>
              </View>
            )
          }
          refreshControl={<PullToRefresh onRefresh={onRefresh} />}
          renderItem={({item, index}) => (
            <ConnectingUser
              userId={item.user.id}
              fullName={item.user.fullName}
              username={item.user.username}
              profilePicUrl={item.user.profilePicUrl}
              userType={item.user.userType}
            />
          )}
          keyExtractor={item => item.user.id.toString()}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ConnectionRequestIcon
                width={120}
                height={120}
                color={textColor}
                strokeWidth={0.8}
              />
              <Text style={[fontBold(16, textColor), {marginTop: 16}]}>
                No New Connection Requests
              </Text>
              <Text
                style={[
                  fontRegular(14, textColor),
                  {marginTop: 10, width: '80%', textAlign: 'center'},
                ]}>
                You’re all caught up! Time to grow your network.
              </Text>
            </View>
          }
        />
      )}
    </PageContainer>
  );
};

type ConnectingUserProps = {
  userId: string;
  fullName: string;
  username: string;
  profilePicUrl: string | null;
  userType: number;
};

const ConnectingUser: React.FC<ConnectingUserProps> = memo(
  ({fullName, profilePicUrl, userId, userType, username}) => {
    const [respondConnectionRequest, {isLoading: respondConnectionRequestCIP}] =
      useRespondConnectionRequestMutation();

    const textColor = useTextColor();
    const lightTextColor = useLightTextColor();
    const navigation = useAppNavigation();

    const handleRespondConnectionRequest = async (
      action: ConnectionReqResponse,
    ) => {
      try {
        await respondConnectionRequest({
          requesterId: userId,
          action: action,
        }).unwrap();
      } catch (err) {
        console.log('error while adding connection', err);
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

        {respondConnectionRequestCIP ? (
          <View style={{width: 50, height: 32}}>
            <Loader size={26} />
          </View>
        ) : (
          <View style={styles.acceptRejectButtonContainer}>
            <PulseEffect>
              <Button
                style={{
                  backgroundColor: appColors.warmRed,
                  width: 46,
                  height: 36,
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
                  width: 46,
                  height: 36,
                }}
                onPress={() => {
                  handleRespondConnectionRequest(ConnectionReqResponse.REJECT);
                }}
                isDisabled={respondConnectionRequestCIP}
                isLoading={respondConnectionRequestCIP}
                _spinner={{
                  color: appColors.white,
                  size: 'sm',
                }}>
                <CrossIcon
                  width={12}
                  height={12}
                  strokeWidth={2}
                  color={appColors.warmRed}
                />
              </Button>
            </PulseEffect>
          </View>
        )}
      </View>
    );
  },
);

export default PendingConnections;

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
