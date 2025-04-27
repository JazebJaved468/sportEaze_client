import {Pressable, StyleSheet, Switch, Text, View} from 'react-native';
import React, {useState} from 'react';
import PageContainer from '../../../components/PageContainer';
import {
  useTextColor,
  useCardColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {
  superAdminApi,
  useGetAppSettingsQuery,
  useUpdateAppSettingsMutation,
} from '../../../store/superAdmin/superAdmin.service';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {fontBold, fontRegular} from '../../../styles/fonts';
import GeneralHeader from '../../../components/GeneralHeader';
import {Loader} from '../../../components/Loader';
import {Button} from 'native-base';
import {appColors} from '../../../constants/colors';
import {useAppDispatch} from '../../../utils/customHooks/storeHooks';
import {PulseEffect} from '../../../components/PulseEffect';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {
  CrossIcon,
  DeleteIcon,
  EditProfileIcon,
  TermsAndConditionsIcon,
  TickIcon,
  WarningIcon,
} from '../../../assets/icons';
import {CustomModal} from '../../../components/CustomModal/CustomModal';
import {updateToast} from '../../../store/core/core.slice';

const GDPR = () => {
  const {data, isLoading} = useGetAppSettingsQuery();
  const [updateGDPRCompliances, {isLoading: isSaving}] =
    useUpdateAppSettingsMutation();

  const dispatch = useAppDispatch();

  const [modalVisible, setModalVisible] = useState(false);

  const textColor = useTextColor();
  const containerShadow = useContainerShadow(10);
  const cardColor = useCardColor();

  console.log('GDPR data', data);

  const handleConsentSwitch = async (val: boolean) => {
    dispatch(
      superAdminApi.util.updateQueryData('getAppSettings', undefined, draft => {
        draft.shouldTakeConsent = val;
      }),
    );
  };

  const handleDataErasureSwitch = async (val: boolean) => {
    dispatch(
      superAdminApi.util.updateQueryData('getAppSettings', undefined, draft => {
        draft.allowDeleteUser = val;
      }),
    );
  };
  const handleDataRectifySwitch = async (val: boolean) => {
    dispatch(
      superAdminApi.util.updateQueryData('getAppSettings', undefined, draft => {
        draft.allowUpdateUser = val;
      }),
    );
  };

  const handleSaveGDPRCompliances = async () => {
    try {
      await updateGDPRCompliances({
        allowDeleteUser: data?.allowDeleteUser,
        allowUpdateUser: data?.allowUpdateUser,
        shouldTakeConsent: data?.shouldTakeConsent,
      }).unwrap();
      setModalVisible(false);
      dispatch(
        updateToast({
          isVisible: true,
          message: 'GDPR Compliances updated successfully',
        }),
      );
    } catch (error) {
      console.log('Error updating GDPR settings:', error);
    }
  };

  return (
    <PageContainer>
      <GeneralHeader title='GDPR Compliances' showRightElement={false} />

      {isLoading ? (
        <Loader />
      ) : (
        <View style={{flex: 1, marginHorizontal: 16}}>
          {/* Article 7  : Consent Mechanism*/}
          <View
            style={[
              {
                backgroundColor: cardColor,
              },
              styles.cardContainer,
              containerShadow,
            ]}>
            <View style={styles.switchRow}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <TermsAndConditionsIcon width={20} height={20} />
                <Text style={fontBold(16, textColor)}>User Consent</Text>
              </View>

              <Switch
                trackColor={{
                  true: appColors.warmRed,
                  false: appColors.lightGray,
                }}
                thumbColor={appColors.white}
                value={data?.shouldTakeConsent}
                onValueChange={val => {
                  handleConsentSwitch(val);
                }}
              />
            </View>

            <Text style={fontRegular(13, textColor)}>
              Users are allowed to give consent before their data is collected
              and processed.
            </Text>
          </View>

          {/* Article 16 : Right to Rectification */}

          <View
            style={[
              {
                backgroundColor: cardColor,
              },
              styles.cardContainer,
              containerShadow,
            ]}>
            <View style={styles.switchRow}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <EditProfileIcon width={20} height={20} />
                <Text style={fontBold(16, textColor)}>Update Information</Text>
              </View>
              <Switch
                trackColor={{
                  true: appColors.warmRed,
                  false: appColors.lightGray,
                }}
                thumbColor={appColors.white}
                value={data?.allowUpdateUser}
                onValueChange={val => {
                  handleDataRectifySwitch(val);
                }}
              />
            </View>

            <Text style={fontRegular(13, textColor)}>
              Users are allowed to update their information if it is incorrect.
            </Text>
          </View>

          {/* Article 17 : Right to Erasure (Right to be Forgotten)*/}

          <View
            style={[
              {
                backgroundColor: cardColor,
              },
              styles.cardContainer,
              containerShadow,
            ]}>
            <View style={styles.switchRow}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <DeleteIcon width={20} height={20} />
                <Text style={fontBold(16, textColor)}>Delete Information</Text>
              </View>
              <Switch
                trackColor={{
                  true: appColors.warmRed,
                  false: appColors.lightGray,
                }}
                thumbColor={appColors.white}
                value={data?.allowDeleteUser}
                onValueChange={val => {
                  handleDataErasureSwitch(val);
                }}
              />
            </View>

            <Text style={fontRegular(13, textColor)}>
              Users are allowed to delete their information (account) if they
              want to.
            </Text>
          </View>

          {/* Save Compliances */}
          <View style={{marginTop: 'auto'}}>
            <PulseEffect>
              <Button
                style={styles.submitButton}
                _text={fontBold(14)}
                onPress={() => {
                  setModalVisible(true);
                }}>
                Save Compliances
              </Button>
            </PulseEffect>
          </View>
        </View>
      )}

      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalHeading='Save Changes ?'>
        <Text style={[fontRegular(14, textColor), {marginBottom: 20}]}>
          You have made the following changes. Do you want to save them ?
        </Text>

        <View style={styles.confirmationItem}>
          <View style={{width: customWidth(15)}}>
            {data?.shouldTakeConsent ? (
              <TickIcon
                width={customWidth(15)}
                height={customHeight(15)}
                color={appColors.success}
              />
            ) : (
              <CrossIcon
                strokeWidth={2.5}
                width={customWidth(13)}
                height={customHeight(13)}
                color={appColors.warmRed}
              />
            )}
          </View>

          <Text
            style={fontBold(
              14,
              data?.shouldTakeConsent ? appColors.success : appColors.warmRed,
            )}>
            User Consent : {data?.shouldTakeConsent ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.confirmationItem}>
          <View style={{width: customWidth(15)}}>
            {data?.allowUpdateUser ? (
              <TickIcon
                width={customWidth(15)}
                height={customHeight(15)}
                color={appColors.success}
              />
            ) : (
              <CrossIcon
                strokeWidth={2.5}
                width={customWidth(13)}
                height={customHeight(13)}
                color={appColors.warmRed}
              />
            )}
          </View>
          <Text
            style={fontBold(
              14,
              data?.allowUpdateUser ? appColors.success : appColors.warmRed,
            )}>
            Update Information :{' '}
            {data?.allowUpdateUser ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.confirmationItem}>
          <View style={{width: customWidth(15)}}>
            {data?.allowDeleteUser ? (
              <TickIcon
                width={customWidth(15)}
                height={customHeight(15)}
                color={appColors.success}
              />
            ) : (
              <CrossIcon
                strokeWidth={2.5}
                width={customWidth(13)}
                height={customHeight(13)}
                color={appColors.warmRed}
              />
            )}
          </View>
          <Text
            style={fontBold(
              14,
              data?.allowDeleteUser ? appColors.success : appColors.warmRed,
            )}>
            Delete Information :{' '}
            {data?.allowDeleteUser ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        {!data?.allowDeleteUser ||
        !data?.allowUpdateUser ||
        !data?.shouldTakeConsent ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginTop: customHeight(10),
            }}>
            <WarningIcon width={customWidth(15)} height={customHeight(15)} />
            <Text style={[fontBold(12, textColor)]}>
              Warning! Some GDPR Compliances are being Violated
            </Text>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: customHeight(20),
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
            isLoading={isSaving}
            onPress={handleSaveGDPRCompliances}
            style={[styles.actionButton, {flex: 1}]}>
            <Text style={fontBold(14, appColors.white)}>Save</Text>
          </Button>
        </View>
      </CustomModal>
    </PageContainer>
  );
};

export default GDPR;

const styles = StyleSheet.create({
  submitButton: {
    height: 48,
    borderRadius: BUTTON_BORDER_RADIUS,
    marginBottom: 20,
  },
  cardContainer: {padding: 16, borderRadius: 12, marginBottom: 20},
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  confirmationItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButton: {height: customHeight(48), borderRadius: BUTTON_BORDER_RADIUS},
});
