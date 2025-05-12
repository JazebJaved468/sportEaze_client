import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {
  useAcceptContractMutation,
  useGetContractByIdQuery,
  useReleaseFundsMutation,
} from '../../../store/patron/patron.service';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {appColors} from '../../../constants/colors';
import {
  ContractIcon,
  EditIcon,
  EditProfileIcon,
  JoinAsPatronIcon,
  MessageIcon,
  MilestoneIcon,
  TickIcon,
  UserPlaceholderIcon,
  WalletIcon,
} from '../../../assets/icons';
import {screenWidth} from '../../SuperAdmin/PatronRequests/PatronRequests';
import {navigateToProfilePage} from '../../../utils/helpers/navigation';
import {Loader} from '../../../components/Loader';
import {format} from 'date-fns';
import {ContractStatus, USER_TYPE} from '../../../constants/enums';
import {PulseEffect} from '../../../components/PulseEffect';
import {Button} from 'native-base';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../utils/customHooks/storeHooks';
import {CreateContractPage} from '../../Patron/CreateContract';
import {ContractStatusBadge} from '../ContractListing/ContractListing';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {ChatScreenPage} from '../../Core/Chat/ChatScreen';
import {WalletPage} from '../../Core/Wallet';

type ContractPreviewPageRouteProp = RouteProp<
  RootStackParamList,
  'ContractPreviewPage'
>;

const ContractPreview = () => {
  const {userType} = useAppSelector(state => state.auth);
  const {params} = useRoute<ContractPreviewPageRouteProp>();
  const navigation = useAppNavigation();

  const {data: contractData, isLoading} = useGetContractByIdQuery({
    contractId: params.contractId,
  });

  const [acceptContract, {isLoading: acceptContractCIP}] =
    useAcceptContractMutation();
  const [releaseFunds, {isLoading: releaseFundsCIP}] =
    useReleaseFundsMutation();

  console.log('params', params);

  const textColor = useTextColor();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  const onAcceptContract = async () => {
    await acceptContract({
      contractId: params.contractId,
    });
  };

  const dispatch = useAppDispatch();
  return (
    <PageContainer>
      <GeneralHeader
        title='Contract Preview'
        // showRightElement={false}
        rightElement={
          userType === USER_TYPE.PATRON &&
          contractData &&
          contractData.status === ContractStatus.PENDING ? (
            <View>
              <PulseEffect>
                <Button
                  onPress={() => {
                    navigation.navigate(CreateContractPage, {
                      isEditing: true,
                      playerId: contractData.player.id,
                      contractId: contractData.id,
                    });
                  }}
                  style={{
                    backgroundColor: appColors.warmRed,
                    borderRadius: 12,
                    width: customWidth(74),
                    height: customHeight(30),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: customWidth(6),
                    }}>
                    <Text style={[fontRegular(13, appColors.white)]}>Edit</Text>
                    <EditIcon
                      strokeWidth={2}
                      width={12}
                      height={12}
                      color={appColors.white}
                    />
                  </View>
                </Button>
              </PulseEffect>
            </View>
          ) : contractData &&
            (contractData.status === ContractStatus.IN_PROGRESS ||
              contractData.status === ContractStatus.COMPLETED) ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(WalletPage);
                }}>
                <WalletIcon
                  width={customWidth(26)}
                  height={customWidth(26)}
                  color={textColor}
                  strokeWidth={1.2}
                />
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      {isLoading || !contractData ? (
        <Loader />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            <Text
              style={[
                fontBold(16, textColor),
                {marginBottom: customHeight(20)},
              ]}>
              A contract between
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: customWidth(10),
              justifyContent: 'center',
            }}>
            {contractData?.patron ? (
              <UserCard
                name={contractData?.patron.fullName}
                username={contractData?.patron.username}
                profilePicUrl={contractData?.patron.profilePicUrl}
                userId={contractData?.patron.id}
                userType={contractData?.patron.userType}
              />
            ) : null}

            <JoinAsPatronIcon
              width={customWidth(60)}
              height={customWidth(60)}
              strokeWidth={1}
            />

            {contractData?.player ? (
              <UserCard
                name={contractData?.player.fullName}
                username={contractData?.player.username}
                profilePicUrl={contractData?.player.profilePicUrl}
                userId={contractData?.player.id}
                userType={contractData?.player.userType}
              />
            ) : null}
          </View>

          {/* 
          Contract */}

          <View style={{marginBottom: customHeight(30)}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: customWidth(10),
                marginBottom: customHeight(20),
                marginTop: customHeight(30),
              }}>
              <ContractIcon width={customWidth(22)} height={customWidth(22)} />
              <Text style={[fontBold(16, textColor)]}>Contract Details</Text>

              <View style={{marginLeft: 'auto'}}>
                <ContractStatusBadge status={contractData.status} />
              </View>
            </View>
            <View
              style={[
                {
                  backgroundColor: cardColor,
                  padding: customWidth(16),
                  borderRadius: 14,
                },
                containerShadow,
              ]}>
              <Text
                style={[
                  fontRegular(13, textColor),
                  {marginBottom: customHeight(20)},
                ]}>
                {contractData.description}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[
                    fontRegular(13, `${textColor}90`),
                    {alignSelf: 'flex-end'},
                  ]}>
                  Date: {format(contractData.startDate, 'dd MMM yyyy')}
                </Text>
                <Text
                  style={[fontRegular(13, textColor), {alignSelf: 'flex-end'}]}>
                  Amount : Rs. {contractData?.totalAmount}
                </Text>
              </View>
            </View>
          </View>

          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginBottom: customHeight(10),
              }}>
              <MilestoneIcon
                width={customWidth(22)}
                height={customWidth(22)}
                color={appColors.warmRed}
              />
              <Text style={[fontBold(16, appColors.warmRed)]}>Milestones</Text>
            </View>

            <View
              style={{gap: customHeight(12), marginBottom: customHeight(10)}}>
              {contractData?.milestones.map((item, index) => {
                return (
                  <View
                    key={item.id}
                    style={[
                      {
                        backgroundColor: cardColor,
                        padding: customWidth(16),
                        borderRadius: 14,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      },
                      containerShadow,
                    ]}>
                    <View>
                      <Text
                        style={[
                          fontRegular(13, textColor),
                          {marginBottom: customHeight(20)},
                        ]}>
                        {item.description}
                      </Text>
                      <Text
                        style={[
                          fontRegular(13, textColor),
                          {alignSelf: 'flex-start'},
                        ]}>
                        Amount : Rs. {item.amount}
                      </Text>
                    </View>

                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: customHeight(20),
                      }}>
                      {userType === USER_TYPE.PATRON &&
                      item.isAchieved &&
                      !item.isPaid ? (
                        <PulseEffect>
                          <Button
                            isLoading={releaseFundsCIP}
                            isDisabled={releaseFundsCIP}
                            onPress={async () => {
                              console.log('Release funds');
                              try {
                                await releaseFunds({
                                  playerId: contractData.player.id,
                                  milestoneId: item.id,
                                });
                              } catch (err) {
                                console.log('Error while releasing funds', err);
                              }
                            }}
                            style={styles.payBtn}>
                            <Text style={fontRegular(12, appColors.white)}>
                              Pay
                            </Text>
                          </Button>
                        </PulseEffect>
                      ) : null}

                      {item.isAchieved && item.isPaid ? (
                        <PulseEffect>
                          <Button
                            style={[
                              styles.payBtn,
                              {
                                borderWidth: 1,
                                borderColor: appColors.warmRed,
                                backgroundColor: appColors.transparent,
                              },
                            ]}>
                            <Text style={fontRegular(12, textColor)}>Paid</Text>
                          </Button>
                        </PulseEffect>
                      ) : null}

                      {item.isAchieved ? (
                        <View
                          style={{
                            width: customWidth(20),
                            height: customWidth(20),
                            backgroundColor: appColors.warmRed,
                            borderRadius: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TickIcon
                            width={customWidth(10)}
                            height={customWidth(10)}
                            color={cardColor}
                          />
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {userType === USER_TYPE.PLAYER &&
          contractData.status === ContractStatus.PENDING ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: customWidth(10),
              }}>
              <Button
                style={[
                  styles.button,
                  {
                    borderWidth: 1,
                    borderColor: appColors.warmRed,
                    backgroundColor: appColors.transparent,
                  },
                ]}
                onPress={() => {
                  navigation.navigate(ChatScreenPage, {
                    receiverId: contractData.patron.id,
                  });
                }}>
                <View style={styles.buttonInnerWrapper}>
                  <MessageIcon
                    width={14}
                    height={14}
                    strokeWidth={2}
                    color={appColors.warmRed}
                  />
                  <Text style={fontRegular(14, appColors.warmRed)}>
                    Negotiate
                  </Text>
                </View>
              </Button>

              <Button
                style={styles.button}
                onPress={onAcceptContract}
                isLoading={acceptContractCIP}>
                <View style={styles.buttonInnerWrapper}>
                  <TickIcon
                    width={14}
                    height={14}
                    strokeWidth={2}
                    color={appColors.white}
                  />
                  <Text style={fontRegular(14, appColors.white)}>
                    Accept Contract
                  </Text>
                </View>
              </Button>
            </View>
          ) : null}
        </ScrollView>
      )}
    </PageContainer>
  );
};

type UserCardProps = {
  name: string;
  username: string;
  profilePicUrl: string;
  userId: string;
  userType: number;
};

const UserCard: React.FC<UserCardProps> = ({
  profilePicUrl,
  username,
  name,
  userId,
  userType,
}) => {
  const containerShadow = useContainerShadow();
  const backgroundColor = useCardColor();
  const textColor = useTextColor();

  return (
    <TouchableOpacity
      style={[{backgroundColor, borderRadius: 14}, containerShadow]}
      onPress={() => {
        navigateToProfilePage({userId, userType});
      }}
      activeOpacity={0.6}>
      <View
        style={[
          {
            minWidth: screenWidth / 3,
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
            <UserPlaceholderIcon
              width={customWidth(34)}
              height={customWidth(34)}
              color={textColor}
            />
          )}
        </View>

        <Text
          style={[fontBold(14, textColor), {marginBottom: customHeight(4)}]}>
          {name}
        </Text>
        <Text style={[fontRegular(12, `${textColor}90`)]}>{username}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ContractPreview;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: customWidth(16),
    paddingVertical: customWidth(10),
    // backgroundColor: 'red',
  },
  button: {
    height: customHeight(40),
    padding: 0,
    marginVertical: 16,
    borderRadius: 20,
    flex: 1,
  },
  buttonInnerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payBtn: {
    height: customHeight(28),
    padding: 0,
    // marginVertical: 16,
    borderRadius: 20,
    width: customWidth(60),
  },
});
