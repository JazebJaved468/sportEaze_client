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
  VerifyIcon,
} from '../../../assets/icons';
import {useDeleteUserMutation} from '../../../store/auth/auth.service';
import {CustomModal} from '../../../components/CustomModal/CustomModal';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {navigateToEditProfilePage} from '../../../utils/helpers/navigation';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';

const AccountSettings = () => {
  const {userType} = useAppSelector(state => state.auth);
  const navigation = useAppNavigation();

  const [deleteProfile, {isLoading: isDeletingProfile}] =
    useDeleteUserMutation();

  const handleDeleteProfile = async () => {
    try {
      await deleteProfile().unwrap();
    } catch (error) {
      console.log('🚀 ~ handleDeleteProfile ~ error:', error);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <PageContainer>
      <GeneralHeader title='Manage Profile' />

      <View style={styles.container}>
        <SettingsItemCard
          onCardPress={() => {
            navigateToEditProfilePage({userType: userType});
          }}
          icon={
            <EditProfileIcon
              strokeWidth={1.3}
              width={customWidth(22)}
              height={customHeight(22)}
            />
          }
          label='Edit Profile'
        />
        <SettingsItemCard
          onCardPress={() => {}}
          icon={
            <VerifyIcon
              strokeWidth={1.3}
              width={customWidth(22)}
              height={customHeight(22)}
            />
          }
          label='Verify Account'
        />

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
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
            {icon}
            <Text style={fontRegular(15, textColor)}>{label}</Text>
          </View>

          <ArrowRightIcon />
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
});
