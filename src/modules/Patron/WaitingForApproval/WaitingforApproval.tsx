import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import {PulseEffect} from '../../../components/PulseEffect';
import {Button} from 'native-base';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {PatronRootPage} from '../Root';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import GeneralHeader from '../../../components/GeneralHeader';
import {UserPendingIcon} from '../../../assets/icons';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';

const WaitingforApproval = () => {
  const navigation = useAppNavigation();
  const textColor = useTextColor();
  const containerShadow = useContainerShadow(6);
  const cardColor = useCardColor();

  return (
    <PageContainer>
      <GeneralHeader
        showLeftElement={false}
        showRightElement={false}
        title={'Welcome'}
      />

      <View
        style={{
          flex: 1,
          marginHorizontal: customWidth(16),
          justifyContent: 'center',
        }}>
        <View
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: cardColor,
              borderRadius: 16,
              marginTop: 'auto',
              paddingVertical: customHeight(40),
            },
            containerShadow,
          ]}>
          <Text style={[fontBold(20, textColor), {marginTop: customHeight(0)}]}>
            Thank you for Registering!
          </Text>

          <View
            style={{
              marginTop: customHeight(50),
              marginBottom: customHeight(40),
            }}>
            <UserPendingIcon
              width={customWidth(120)}
              height={customHeight(120)}
              color={textColor}
            />
          </View>

          <Text
            style={[
              fontRegular(16, textColor),
              {
                textAlign: 'center',
                marginHorizontal: 20,
                lineHeight: 24,
              },
            ]}>
            {`Your organization profile has been submitted for review, Our team is working to approve your account shortly.`}
          </Text>
        </View>
        <View style={{marginTop: 'auto'}}>
          <PulseEffect>
            <Button
              style={styles.submitButton}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{name: PatronRootPage}],
                });
              }}>
              Continue
            </Button>
          </PulseEffect>
        </View>
      </View>
    </PageContainer>
  );
};

export default WaitingforApproval;

const styles = StyleSheet.create({
  submitButton: {
    height: 48,
    borderRadius: BUTTON_BORDER_RADIUS,
    marginBottom: 20,
  },
});
