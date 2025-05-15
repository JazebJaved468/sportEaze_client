import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Loader} from '../../../components/Loader';
import {AddIcon, ContractIcon, MessageIcon} from '../../../assets/icons';
import GeneralHeader from '../../../components/GeneralHeader';
import {LoginRequired} from '../../../components/LoginRequired';
import PageContainer from '../../../components/PageContainer';
import PullToRefresh from '../../../components/PullToRefresh';
import {useGetChatListingQuery} from '../../../store/core/core.service';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {customHeight} from '../../../styles/responsiveStyles';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  useGetContractsByUserIdQuery,
  useGetMyContractsQuery,
} from '../../../store/patron/patron.service';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {
  ContractCard,
  ContractListingPageRouteProp,
} from '../../Contract/ContractListing/ContractListing';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';
import {ContractStatus, USER_TYPE} from '../../../constants/enums';
import {PulseEffect} from '../../../components/PulseEffect';
import {appColors} from '../../../constants/colors';
import {CreateContractPage} from '../CreateContract';
import {Button} from 'native-base';

export type PatronContractListingPageRouteProp = RouteProp<
  RootStackParamList,
  'PatronContractListingPage'
>;

const PatronContractListing = () => {
  const {params} = useRoute<PatronContractListingPageRouteProp>();
  const navigation = useAppNavigation();
  const {userType, isLoggedIn, user} = useAppSelector(state => state.auth);

  const {
    data: contracts,
    isLoading: contractsCIP,
    refetch,
  } = useGetMyContractsQuery({
    filter: ContractStatus.All,
    userId: user?.id ?? '',
  });

  console.log('params', user?.id);

  console.log('contracts', contracts?.[0]);

  const textColor = useTextColor();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  const onRefresh = async () => {
    await refetch();
  };

  return (
    <PageContainer>
      <GeneralHeader title='My Contracts' />

      {!isLoggedIn ? (
        <LoginRequired message={'Login to access your contracts'} />
      ) : contractsCIP || !contracts ? (
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
          refreshControl={<PullToRefresh onRefresh={onRefresh} />}
          renderItem={({item, index}) => (
            <ContractCard data={item} showPlayerInfo />
          )}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ContractIcon
                width={80}
                height={80}
                color={textColor}
                strokeWidth={0.8}
              />
              <Text style={[fontBold(16, textColor), {marginTop: 16}]}>
                You have no contracts yet with players
              </Text>
            </View>
          }
        />
      )}
    </PageContainer>
  );
};

export default PatronContractListing;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexGrow: 1,
    paddingBottom: customHeight(50),
  },
});
