import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode, useState} from 'react';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {PulseEffect} from '../../../components/PulseEffect';
import {Button} from 'native-base';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {appColors} from '../../../constants/colors';
import {
  ArrowRightIcon,
  DeleteIcon,
  EditProfileIcon,
  TickIcon,
  UserApprovedIcon,
  UserPendingIcon,
  UserRejectedIcon,
  VerifyIcon,
} from '../../../assets/icons';
import {useDeleteUserMutation} from '../../../store/auth/auth.service';
import {CustomModal} from '../../../components/CustomModal/CustomModal';
import {
  useCardColor,
  usePageBackgroundColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {navigateToEditProfilePage} from '../../../utils/helpers/navigation';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../utils/customHooks/storeHooks';
import {useGetAppSettingsQuery} from '../../../store/superAdmin/superAdmin.service';
import {updateToast, updateUserConsent} from '../../../store/core/core.slice';
import {PatronAccountStatus, USER_TYPE} from '../../../constants/enums';

const AccountSettings = () => {
  const {userType} = useAppSelector(state => state.auth);
  const {userConsent} = useAppSelector(state => state.core);
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const {data: appSettings} = useGetAppSettingsQuery();
  const [deleteProfile, {isLoading: isDeletingProfile}] =
    useDeleteUserMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const textColor = useTextColor();
  const pageColor = usePageBackgroundColor();
  const containerShadow = useContainerShadow(4);
  const cardColor = useCardColor();

  const handleDeleteProfile = async () => {
    try {
      await deleteProfile().unwrap();
    } catch (error) {
      console.log('🚀 ~ handleDeleteProfile ~ error:', error);
    }
  };

  const handleUserConsent = async () => {
    dispatch(updateUserConsent(!userConsent));
  };

  return (
    <PageContainer>
      <GeneralHeader title='Manage Profile' />

      <View style={styles.container}>
        {userType === USER_TYPE.PATRON ? <AccountPending /> : null}

        {appSettings?.allowUpdateUser ? (
          <SettingsItemCard
            onCardPress={() => {
              navigateToEditProfilePage({userType: userType});
            }}
            icon={
              <EditProfileIcon
                strokeWidth={1.3}
                width={customWidth(22)}
                height={customHeight(22)}
                color={textColor}
              />
            }
            label='Edit Profile'
          />
        ) : null}
        <SettingsItemCard
          onCardPress={() => {
            dispatch(updateToast({isVisible: true, message: 'Coming Soon'}));
          }}
          icon={
            <VerifyIcon
              strokeWidth={1.3}
              width={customWidth(22)}
              height={customHeight(22)}
              color={textColor}
            />
          }
          label='Verify Email'
        />

        <View
          style={[
            containerShadow,
            {backgroundColor: cardColor, borderRadius: 20},
          ]}>
          <TouchableOpacity
            hitSlop={14}
            activeOpacity={0.7}
            onPress={handleUserConsent}>
            <View
              style={{
                flexDirection: 'row',
                gap: customWidth(16),
                alignItems: 'center',
                paddingVertical: customHeight(22),
                paddingHorizontal: customWidth(20),
                paddingRight: customWidth(20),
              }}>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: textColor,

                    backgroundColor: userConsent ? textColor : pageColor,
                  },
                ]}>
                {userConsent ? (
                  <TickIcon
                    width={customWidth(9)}
                    height={customWidth(10)}
                    color={pageColor}
                  />
                ) : null}
              </View>
              <Text style={[fontRegular(15, textColor), {flex: 1}]}>
                Use My Data for Marketing And Advertising purposes
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {appSettings?.allowDeleteUser ? (
          <View style={{marginTop: 'auto'}}>
            <PulseEffect>
              <Button
                isLoading={isDeletingProfile}
                style={styles.deleteButton}
                onPress={() => {
                  setModalVisible(true);
                }}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                  <DeleteIcon
                    strokeWidth={1.8}
                    width={customWidth(20)}
                    height={customHeight(20)}
                    color={appColors.white}
                  />
                  <Text style={fontBold(14, appColors.white)}>
                    Delete Profile
                  </Text>
                </View>
              </Button>
            </PulseEffect>
          </View>
        ) : null}
      </View>

      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalHeading='Delete Profile ? '>
        <View style={{paddingVertical: customHeight(10)}}>
          <Text
            style={[fontRegular(15, appColors.black), {textAlign: 'center'}]}>
            Are you sure you want to{' '}
            <Text
              style={[fontBold(15, appColors.black), {textAlign: 'center'}]}>
              delete your profile?
            </Text>{' '}
            This action cannot be undone.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginTop: customHeight(30),
            }}>
            <Button
              onPress={() => {
                setModalVisible(false);
              }}
              style={[
                styles.actionButton,
                {
                  backgroundColor: appColors.transparent,
                  borderWidth: 1,
                  borderColor: appColors.warmRed,
                  flex: 1,
                },
              ]}>
              <Text style={fontBold(14, appColors.warmRed)}>Cancel</Text>
            </Button>

            <Button
              isLoading={isDeletingProfile}
              onPress={handleDeleteProfile}
              style={[styles.actionButton, {flex: 1}]}>
              <Text style={fontBold(14, appColors.white)}>Delete</Text>
            </Button>
          </View>
        </View>
      </CustomModal>
    </PageContainer>
  );
};

const AccountPending = () => {
  const {userType, user} = useAppSelector(state => state.auth);

  const isAccountPending = user?.patron?.status === PatronAccountStatus.PENDING;
  const isAccountRejected =
    user?.patron?.status === PatronAccountStatus.REJECTED;
  const isAccountApproved =
    user?.patron?.status === PatronAccountStatus.APPROVED;
  const isAccountModificationRequired =
    user?.patron?.status === PatronAccountStatus.MODIFICATION_REQUIRED;

  const getColor = () => {
    if (isAccountPending) {
      return `${appColors.gold}40`;
    } else if (isAccountApproved) {
      return `${appColors.success}40`;
    } else if (isAccountModificationRequired) {
      return `${appColors.masculineBlue}30`;
    } else if (isAccountRejected) {
      return `${appColors.error}40`;
    }
  };

  const getBorderColor = () => {
    if (isAccountPending) {
      return `${appColors.gold}`;
    } else if (isAccountApproved) {
      return `${appColors.success}`;
    } else if (isAccountModificationRequired) {
      return `${appColors.masculineBlue}`;
    } else if (isAccountRejected) {
      return `${appColors.error}`;
    }
  };

  const getMessage = () => {
    if (isAccountPending) {
      return 'Your account is under review';
    } else if (isAccountApproved) {
      return 'Your account is approved';
    } else if (isAccountModificationRequired) {
      return 'Profile update needed';
    } else if (isAccountRejected) {
      return 'Your account was not approved';
    }
  };

  const getIcon = () => {
    if (isAccountPending) {
      return (
        <UserPendingIcon
          width={customWidth(19)}
          height={customHeight(19)}
          color={appColors.black}
        />
      );
    } else if (isAccountApproved) {
      return (
        <UserApprovedIcon
          width={customWidth(19)}
          height={customHeight(19)}
          color={appColors.black}
        />
      );
    } else if (isAccountModificationRequired) {
      return (
        <EditProfileIcon
          width={customWidth(19)}
          height={customHeight(19)}
          color={appColors.black}
        />
      );
    } else if (isAccountRejected) {
      return (
        <UserRejectedIcon
          width={customWidth(19)}
          height={customHeight(19)}
          color={appColors.black}
        />
      );
    }
  };

  return (
    <View
      style={{
        backgroundColor: getColor(),
        borderWidth: 1,
        borderColor: getBorderColor(),
        borderRadius: 20,
        borderStyle: 'dashed',
        paddingVertical: customHeight(16),
        paddingHorizontal: customWidth(20),
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: customWidth(16),
        }}>
        {getIcon()}
        <Text style={[fontRegular(14, appColors.black)]}>{getMessage()}</Text>
      </View>
      {user?.patron?.adminReviewComment ? (
        <Text
          style={[
            fontRegular(14, appColors.black),
            {marginTop: customHeight(12)},
          ]}>
          Admin Feedback : {user?.patron?.adminReviewComment}
        </Text>
      ) : null}
    </View>
  );
};

const SettingsItemCard = ({
  onCardPress,
  label,
  icon,
}: {
  onCardPress: () => void;
  label: string;
  icon: ReactNode;
}) => {
  const containerShadow = useContainerShadow(4);
  const cardColor = useCardColor();
  const textColor = useTextColor();
  return (
    <View
      style={[
        containerShadow,
        {
          backgroundColor: cardColor,
          borderRadius: 20,
          // marginBottom: customHeight(16),
        },
      ]}>
      <TouchableOpacity
        onPress={onCardPress}
        style={{
          paddingVertical: customHeight(22),
          paddingHorizontal: customWidth(20),
          paddingRight: customWidth(20),
        }}
        activeOpacity={0.5}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: customWidth(16),
            }}>
            {icon}
            <Text style={fontRegular(15, textColor)}>{label}</Text>
          </View>

          <ArrowRightIcon color={textColor} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: customWidth(16),
    gap: customWidth(10),
  },
  deleteButton: {
    height: 48,
    borderRadius: BUTTON_BORDER_RADIUS,
    marginBottom: 20,
  },

  actionButton: {height: customHeight(48), borderRadius: BUTTON_BORDER_RADIUS},
  checkbox: {
    width: customWidth(16),
    height: customWidth(16),
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
