import {StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';
import PageContainer from '../../../components/PageContainer';
import {fontBold} from '../../../styles/fonts';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {
  ComplianceIcon,
  ConnectionRequestIcon,
  LogoutIcon,
  SportEazeLogo,
} from '../../../assets/icons';
import {appColors} from '../../../constants/colors';
import {Button} from 'native-base';
import {onLogout} from '../../../utils/helpers/auth';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppNavigation} from '../../../utils/customHooks/navigator';

const SuperAdminRoot = () => {
  const textColor = useTextColor();
  const containerShadow = useContainerShadow(10);
  const cardColor = useCardColor();
  const navigation = useAppNavigation();
  return (
    <PageContainer>
      {/* Header */}
      <View style={[styles.header, containerShadow]}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
          <SportEazeLogo color={appColors.white} width={50} height={50} />
          <Text style={fontBold(20, appColors.white)}>SportEaze Admin</Text>
        </View>

        <Button onPress={onLogout} backgroundColor={appColors.transparent}>
          <View style={{padding: 10}}>
            <LogoutIcon
              strokeWidth={1.5}
              width={24}
              height={24}
              color={appColors.white}
            />
          </View>
        </Button>
      </View>

      {/* Body */}

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginHorizontal: 16,
          gap: 10,
        }}>
        <HomeItemCard onCardPress={() => {}}>
          <View style={{alignItems: 'center', gap: 16}}>
            <ComplianceIcon
              width={customWidth(40)}
              height={customHeight(40)}
              color={textColor}
            />
            <Text style={fontBold(16, textColor)}>GDPR Compliances</Text>
          </View>
        </HomeItemCard>

        <HomeItemCard onCardPress={() => {}}>
          <View style={{alignItems: 'center', gap: 16}}>
            <ConnectionRequestIcon
              width={customWidth(40)}
              height={customHeight(40)}
              color={textColor}
            />
            <Text style={fontBold(16, textColor)}>Patron Requests</Text>
          </View>
        </HomeItemCard>
      </View>
    </PageContainer>
  );
};

const HomeItemCard = ({
  children,
  onCardPress,
}: {
  children: ReactNode;
  onCardPress: () => void;
}) => {
  const containerShadow = useContainerShadow(10);
  const cardColor = useCardColor();
  return (
    <View
      style={[
        containerShadow,
        {
          height: customHeight(200),
          backgroundColor: cardColor,
          flex: 1,
          borderRadius: 20,
          justifyContent: 'center',
        },
      ]}>
      <TouchableOpacity
        onPress={onCardPress}
        style={{
          height: customHeight(200),
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={0.5}>
        {children}
      </TouchableOpacity>
    </View>
  );
};

export default SuperAdminRoot;

const styles = StyleSheet.create({
  header: {
    padding: 30,
    margin: 16,
    backgroundColor: appColors.warmRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
  },
});
