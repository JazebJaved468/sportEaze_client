import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import {appColors} from '../../../constants/colors';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {
  useCardColor,
  useLightTextColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {
  ArrowRightIcon,
  ConnectionRequestIcon,
  ConnectionsIcon,
  DashboardIcon,
  EditProfileIcon,
  FollowingsIcon,
  LogoutIcon,
  MoonIcon,
  PrivacyPolicyIcon,
  SettingsIcon,
  SunIcon,
  TermsAndConditionsIcon,
  UserPlaceholderIcon,
  WalletIcon,
} from '../../../assets/icons';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../utils/customHooks/storeHooks';
import {Switch, useColorMode} from 'native-base';
import {Divider} from '../../../components/Divider';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {onLogout} from '../../../utils/helpers/auth';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {LoginRequired} from '../../../components/LoginRequired';
import {storeInLocalStorage} from '../../../utils/helpers/asyncStorage';
import {USER_TYPE} from '../../../constants/enums';
import {navigateToProfilePage} from '../../../utils/helpers/navigation';
import {
  AcceptedConnectionsPage,
  FollowingListingPage,
  PendingConnectionsPage,
} from '../Networking';
import {AccountSettingsPage} from '../AccountSettings';
import {FollowerListingPage} from '../../Player/Followerlisting';
import {WalletPage} from '../Wallet';
import {PlayerComparisonPage} from '../../Player/PlayerComparison';
import {PrivacyPolicyPage, TermsAndConditionsPage} from '../PrivacyPolicy';

const {height: screenHeight} = Dimensions.get('window');

const MenuSectionHeader = ({title}: {title: string}) => {
  const textColor = useTextColor();

  const lightTextColor = useLightTextColor();
  return (
    <View style={styles.menuSectionHeader}>
      <Text style={fontRegular(14, lightTextColor)}>{title}</Text>
    </View>
  );
};

const MenuSection = ({children}: {children: React.ReactNode}) => {
  return (
    <View>
      <Divider />
      <View style={{paddingVertical: 10}}>{children}</View>
    </View>
  );
};

const MenuSectionItem = ({
  title,
  rightIcon,
  onPress,
  leftIcon,
  showRightIcon = true,
  isLoading = false,
  activeOpacity = 0.6,
}: {
  title: string;
  rightIcon?: React.ReactNode;
  leftIcon: React.ReactNode;
  onPress: () => void;
  showRightIcon?: boolean;
  isLoading?: boolean;
  activeOpacity?: number;
}) => {
  const textColor = useTextColor();
  return (
    <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress}>
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
          <View
            style={{
              width: 22,
              height: 22,
              justifyContent: 'center',
              alignItems: 'center',

              //   overflow: 'hidden',
            }}>
            {isLoading ? <ActivityIndicator /> : leftIcon}
          </View>

          <Text style={fontRegular(14, useTextColor())}>{title}</Text>
        </View>
        {showRightIcon
          ? (rightIcon ?? <ArrowRightIcon width={7} color={textColor} />)
          : null}
      </View>
    </TouchableOpacity>
  );
};

const getTitle = (userType: number) => {
  if (userType === USER_TYPE.FAN) {
    return 'Fan Dashboard';
  } else if (userType === USER_TYPE.PLAYER) {
    return 'Player Dashboard';
  } else if (userType === USER_TYPE.PATRON) {
    return 'Patron Dashboard';
  } else if (userType === USER_TYPE.MENTOR) {
    return 'Mentor Dashboard';
  } else {
    return 'User Dashboard';
  }
};

const Menu = () => {
  const {user, isLoggedIn, userType} = useAppSelector(state => state.auth);

  const {colorMode, setColorMode, toggleColorMode} = useColorMode();
  const containerShadow = useContainerShadow(4);
  const textColor = useTextColor();
  const lightTextColor = useLightTextColor();
  const navigation = useAppNavigation();
  const cardColor = useCardColor();

  console.log('user ID ', user?.id);

  const dispatch = useAppDispatch();

  return (
    <PageContainer>
      <View style={styles.absoluteBackground} />

      <View style={styles.header}>
        <DashboardIcon
          fill={'none'}
          color={appColors.white}
          width={24}
          height={24}
        />
        <Text style={fontBold(18, appColors.white)}>{getTitle(userType)}</Text>
      </View>

      <View
        style={[
          styles.menuContainer,
          {
            backgroundColor: cardColor,
          },
          containerShadow,
        ]}>
        {isLoggedIn ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={styles.scrollContainer}>
            {/* Profile Pic And Name */}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                if (user?.id) {
                  navigateToProfilePage({
                    userId: user.id,
                    userType: user.userType,
                  });
                }
              }}>
              <View style={styles.picAndName}>
                <View style={styles.profilePicContainer}>
                  {user?.profilePicUrl ? (
                    <Image
                      source={{uri: user?.profilePicUrl}}
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
                <View style={{gap: 2}}>
                  <Text style={fontRegular(16, textColor)}>
                    {user?.fullName}
                  </Text>
                  <Text style={fontRegular(12, lightTextColor)}>
                    {user?.username}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Your Network */}
            <MenuSection>
              <MenuSectionHeader title='Network' />
              <MenuSectionItem
                title={
                  userType === USER_TYPE.PLAYER ? 'Followers' : 'Followings'
                }
                leftIcon={
                  <FollowingsIcon width={20} height={20} color={textColor} />
                }
                onPress={() => {
                  userType === USER_TYPE.PLAYER
                    ? navigation.navigate(FollowerListingPage)
                    : navigation.navigate(FollowingListingPage);
                }}
              />
              {userType !== USER_TYPE.PLAYER ? (
                <MenuSectionItem
                  title='Connections'
                  leftIcon={
                    <ConnectionsIcon width={20} height={20} color={textColor} />
                  }
                  onPress={() => {
                    navigation.navigate(AcceptedConnectionsPage);
                  }}
                />
              ) : null}

              {userType !== USER_TYPE.PLAYER ? (
                <MenuSectionItem
                  title='Connection Requests'
                  leftIcon={
                    <ConnectionRequestIcon
                      width={20}
                      height={20}
                      color={textColor}
                      strokeWidth={1.1}
                    />
                  }
                  onPress={() => {
                    navigation.navigate(PendingConnectionsPage);
                  }}
                />
              ) : null}

              {userType === USER_TYPE.PLAYER ||
              userType === USER_TYPE.PATRON ? (
                <MenuSectionItem
                  title='My Wallet'
                  leftIcon={
                    <WalletIcon
                      width={20}
                      height={20}
                      color={textColor}
                      strokeWidth={1.1}
                    />
                  }
                  onPress={() => {
                    navigation.navigate(WalletPage);
                  }}
                />
              ) : null}
            </MenuSection>

            {/* Account Settings */}
            <MenuSection>
              <MenuSectionHeader title='Account Settings' />
              <MenuSectionItem
                title='Manage Profile'
                leftIcon={
                  <SettingsIcon
                    width={20}
                    height={20}
                    strokeWidth={1.2}
                    color={textColor}
                  />
                }
                onPress={() => {
                  navigation.navigate(AccountSettingsPage);
                }}
              />
            </MenuSection>

            {/* Personalization */}
            <MenuSection>
              <MenuSectionHeader title='Personalizations' />
              <MenuSectionItem
                activeOpacity={1}
                // showRightIcon={false}
                title={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
                leftIcon={
                  colorMode === 'light' ? (
                    <MoonIcon width={20} height={20} color={textColor} />
                  ) : (
                    <SunIcon width={20} height={20} color={textColor} />
                  )
                }
                rightIcon={
                  <Switch
                    trackColor={{
                      true: appColors.warmRed,
                      false: appColors.warmRed,
                    }}
                    thumbColor={appColors.white}
                    size={'md'}
                    value={colorMode === 'light' ? false : true}
                  />
                }
                onPress={() => {
                  toggleColorMode();

                  storeInLocalStorage({
                    key: 'colorMode',
                    value: colorMode === 'light' ? 'dark' : 'light',
                  });
                }}
              />
            </MenuSection>

            {/* App Policies */}
            <MenuSection>
              <MenuSectionHeader title='App Policies' />
              <MenuSectionItem
                title='Terms And Conditions'
                leftIcon={
                  <TermsAndConditionsIcon
                    width={18}
                    height={18}
                    color={textColor}
                  />
                }
                onPress={() => {
                  navigation.navigate(TermsAndConditionsPage);
                }}
              />
              <MenuSectionItem
                title='Privacy Policy'
                leftIcon={
                  <PrivacyPolicyIcon width={20} height={20} color={textColor} />
                }
                onPress={() => {
                  navigation.navigate(PrivacyPolicyPage);
                }}
              />
            </MenuSection>

            {/* Logout */}

            <MenuSection>
              <MenuSectionHeader title='Switch Account' />
              <MenuSectionItem
                showRightIcon={false}
                title='Logout'
                leftIcon={
                  <LogoutIcon
                    strokeWidth={1}
                    width={20}
                    height={20}
                    color={textColor}
                  />
                }
                onPress={async () => {
                  await onLogout();
                }}
              />
            </MenuSection>
          </ScrollView>
        ) : (
          <LoginRequired
            message={'Login to access your profile'}
            applyShadow={false}
          />
        )}
      </View>
    </PageContainer>
  );
};

export default Menu;

const styles = StyleSheet.create({
  absoluteBackground: {
    position: 'absolute',
    width: '100%',
    height: 290,
    backgroundColor: appColors.warmRed,
    zIndex: -2,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 42,
    gap: 16,
  },
  menuContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    height: screenHeight - 210,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  picAndName: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
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
  menuSectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.black,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
});
