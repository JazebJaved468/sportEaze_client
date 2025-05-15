import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';
import {
  patronApi,
  useGetContractsByUserIdQuery,
} from '../../../store/patron/patron.service';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {Loader} from '../../../components/Loader';
import PullToRefresh from '../../../components/PullToRefresh';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {PulseEffect} from '../../../components/PulseEffect';
import {Button} from 'native-base';
import {appColors} from '../../../constants/colors';
import {
  AddIcon,
  ContractIcon,
  UserPlaceholderIcon,
} from '../../../assets/icons';
import {Contract} from '../../../types/patron/patron.type';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../utils/customHooks/storeHooks';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {format} from 'date-fns';
import {ContractStatus, USER_TYPE} from '../../../constants/enums';
import {CreateContractPage} from '../../Patron/CreateContract';
import {ContractPreviewPage} from '../ContractPreview';

export type ContractListingPageRouteProp = RouteProp<
  RootStackParamList,
  'ContractListingPage'
>;

const ContractListing = () => {
  const {params} = useRoute<ContractListingPageRouteProp>();
  const navigation = useAppNavigation();
  const {userType} = useAppSelector(state => state.auth);

  const {
    data: contracts,
    isLoading: contractsCIP,
    refetch,
  } = useGetContractsByUserIdQuery({userId: params.userId});

  console.log('params', params);

  console.log('contracts', contracts?.[0]);

  const textColor = useTextColor();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  const onRefresh = async () => {
    await refetch();
  };

  const dispatch = useAppDispatch();

  return (
    <PageContainer>
      <GeneralHeader title='Contracts' showRightElement={true} />

      {contractsCIP || !contracts ? (
        <Loader />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{
            paddingHorizontal: 16,
            flexGrow: 1,
            paddingBottom: 30,
            gap: 16,
            paddingTop: 10,
          }}
          data={contracts}
          ListHeaderComponent={
            userType === USER_TYPE.PATRON ? (
              <View>
                <PulseEffect>
                  <Button
                    style={{
                      height: 44,
                    }}
                    onPress={() => {
                      navigation.navigate(CreateContractPage, {
                        isEditing: false,
                        playerId: params.userId,
                      });
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                      <AddIcon width={18} height={18} color={appColors.white} />

                      <Text style={[fontRegular(14, appColors.white)]}>
                        Create New Contract
                      </Text>
                    </View>
                  </Button>
                </PulseEffect>
              </View>
            ) : null
          }
          refreshControl={<PullToRefresh onRefresh={onRefresh} />}
          renderItem={({item, index}) => <ContractCard data={item} />}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  fontRegular(15, textColor),
                  {marginTop: 16, width: '80%', textAlign: 'center'},
                ]}>
                Looks like you don’t have any contracts with this person yet.
              </Text>
            </View>
          }
        />
      )}
    </PageContainer>
  );
};

export const ContractCard = ({
  data,
  showPlayerInfo = false,
}: {
  data: Contract;
  showPlayerInfo?: boolean;
}) => {
  const {userType} = useAppSelector(state => state.auth);
  const textColor = useTextColor();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  const backgroundColor = useCardColor();

  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      style={[{backgroundColor, borderRadius: 14}, containerShadow]}
      onPress={() => {
        navigation.navigate(ContractPreviewPage, {contractId: data.id});
      }}
      activeOpacity={0.6}>
      <View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: customHeight(18),
          },
        ]}>
        {showPlayerInfo ? (
          <View style={styles.picAndName}>
            <View style={styles.profilePicContainer}>
              {data.player?.profilePicUrl ? (
                <Image
                  source={{uri: data.player?.profilePicUrl}}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'contain',
                    borderRadius: 9,
                  }}
                />
              ) : (
                <UserPlaceholderIcon width={28} height={28} color={textColor} />
              )}
            </View>

            <Text style={fontRegular(13, textColor)}>
              {data.player?.fullName}
            </Text>
          </View>
        ) : null}
        <View style={{marginBottom: customHeight(20), alignSelf: 'flex-start'}}>
          <ContractStatusBadge status={data.status} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: customWidth(14),
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: customHeight(20),
          }}>
          <ContractIcon />
          <Text
            numberOfLines={2}
            style={[fontRegular(14, textColor), {lineHeight: 20, flex: 1}]}>
            {data.description}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={[
              fontRegular(12, `${textColor}90`),
              {alignSelf: 'flex-end'},
            ]}>
            {format(data.startDate, 'dd MMM yyyy')}
          </Text>
          <Text style={[fontBold(14, `${textColor}`), {alignSelf: 'flex-end'}]}>
            Amount: Rs. {data.totalAmount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ContractStatusBadge = ({status}: {status: number}) => {
  const isPending = status === ContractStatus.PENDING;
  const isInProgress = status === ContractStatus.IN_PROGRESS;
  const isCompleted = status === ContractStatus.COMPLETED;

  const getColor = () => {
    if (isPending) {
      return `${appColors.gold}40`;
    } else if (isInProgress) {
      return `${appColors.success}40`;
    } else if (isCompleted) {
      return `${appColors.masculineBlue}30`;
    }
  };

  const getBorderColor = () => {
    if (isPending) {
      return `${appColors.gold}`;
    } else if (isInProgress) {
      return `${appColors.success}`;
    } else if (isCompleted) {
      return `${appColors.masculineBlue}`;
    }
  };

  const getMessage = () => {
    if (isPending) {
      return 'Pending';
    } else if (isInProgress) {
      return 'In Progress';
    } else if (isCompleted) {
      return 'Completed';
    }
  };

  return (
    <View
      style={{
        backgroundColor: getColor(),
        // borderWidth: 1,
        borderColor: getBorderColor(),
        borderRadius: 6,
        borderStyle: 'dashed',
        paddingVertical: customHeight(5),
        paddingHorizontal: customWidth(8),
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: customWidth(5),
        }}>
        <View
          style={{
            width: customWidth(10),
            height: customHeight(10),
            backgroundColor: getColor(),
            borderRadius: 5,
          }}
        />

        <Text style={[fontRegular(10, appColors.black)]}>{getMessage()}</Text>
      </View>
    </View>
  );
};

export default ContractListing;

const styles = StyleSheet.create({
  picAndName: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: customHeight(16),
  },
  profilePicContainer: {
    width: 40,
    height: 40,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
});
