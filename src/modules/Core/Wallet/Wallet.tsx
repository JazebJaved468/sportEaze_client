import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';
import GeneralHeader from '../../../components/GeneralHeader';
import {USER_TYPE} from '../../../constants/enums';
import {WalletIcon} from '../../../assets/icons';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {appColors} from '../../../constants/colors';

const Wallet = () => {
  const {user, userType} = useAppSelector(state => state.auth);

  const textColor = useTextColor();
  const cardColor = useCardColor();
  const containerShadow = useContainerShadow(4);

  console.log('Wallet ------------> User:', user);

  const cash =
    userType === USER_TYPE.PLAYER
      ? user?.player?.wallet.cash
      : user?.patron?.wallet.cash;

  const payable =
    userType === USER_TYPE.PLAYER ? 0 : user?.patron?.wallet.payables;

  return (
    <PageContainer>
      <GeneralHeader title='Your Wallet' showRightElement />

      <View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: cardColor,
            marginHorizontal: customWidth(20),
            marginTop: customHeight(20),
            borderRadius: 20,
            paddingVertical: customHeight(30),
            paddingHorizontal: customWidth(30),
          },
          containerShadow,
        ]}>
        <WalletIcon width={80} height={80} strokeWidth={1} />
        <Text
          style={[fontRegular(16, textColor), {marginTop: customHeight(20)}]}>
          {`You have  `}
          <Text style={[fontBold(16, appColors.warmRed)]}>Rs. {cash}</Text>
          {`  in your Wallet`}
        </Text>

        {userType === USER_TYPE.PATRON ? (
          <Text
            style={[
              fontRegular(16, textColor),
              {
                marginTop: customHeight(20),
                textAlign: 'center',
                lineHeight: 24,
              },
            ]}>
            {`You have to Pay `}
            <Text style={[fontBold(16, appColors.warmRed), {lineHeight: 24}]}>
              Rs. {payable}
            </Text>
            {` to the Players based on your Contracts`}
          </Text>
        ) : null}
      </View>
    </PageContainer>
  );
};

export default Wallet;

const styles = StyleSheet.create({});
