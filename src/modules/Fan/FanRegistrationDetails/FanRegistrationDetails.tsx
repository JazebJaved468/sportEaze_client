import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {useTextColor} from '../../../utils/customHooks/colorHooks';
import {Button} from 'native-base';
import {Controller, useForm} from 'react-hook-form';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {appColors} from '../../../constants/colors';
import {Image as ImageType} from 'react-native-image-crop-picker';
import {useUploadImageMutation} from '../../../store/postFeed/postFeed.service';
import {CloudinaryUploadPresets} from '../../../constants/cloudinary';
import {useRegisterFanMutation} from '../../../store/fan/fan.service';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {PulseEffect} from '../../../components/PulseEffect';
import {MultiItemSelector} from '../../../components/MultiItemSelector';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {RegisterFanParams} from '../../../types/fan/fan.params';
import {RecommendationsPage} from '../Recommendations';
import {RegistrationGeneralDetails} from '../../../components/RegistrationGeneralDetails';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../utils/customHooks/storeHooks';
import {AccountSettingsPage} from '../../Core/AccountSettings';
import {useUpdateFanMutation} from '../../../store/auth/auth.service';
import {updateToast, updateUserConsent} from '../../../store/core/core.slice';
import {onLogout} from '../../../utils/helpers/auth';
import {LogoutIcon} from '../../../assets/icons';
import {useGetAppSettingsQuery} from '../../../store/superAdmin/superAdmin.service';
import {CustomModal} from '../../../components/CustomModal/CustomModal';
import {customHeight} from '../../../styles/responsiveStyles';
import {useGetAvailableSportsQuery} from '../../../store/core/core.service';

type FanRegistrationDetailsPageRouteProp = RouteProp<
  RootStackParamList,
  'FanRegistrationDetailsPage'
>;

export type RegisterFanFormData = {
  profilePic?: ImageType | null;
  fullName?: string;
  username?: string;
  dob?: string;
  gender?: number;
  sportInterests?: number[];
};

const FanRegistrationDetails = () => {
  const navigation = useAppNavigation();
  const {params} = useRoute<FanRegistrationDetailsPageRouteProp>();

  console.log('params', params);

  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFanFormData>({});

  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const textColor = useTextColor();

  const handleBackPress = () => {
    if (registrationStep > 1) {
      setRegistrationStep(registrationStep - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <PageContainer applyGradient>
      <GeneralHeader
        title={params.isEditProfile ? 'Edit Profile' : 'Fan Details'}
        backHandler={handleBackPress}
        rightElement={
          params.isEditProfile ? null : (
            <TouchableOpacity
              activeOpacity={0.5}
              hitSlop={20}
              onPress={onLogout}
              style={{marginRight: -10}}>
              <View style={{padding: 10}}>
                <LogoutIcon
                  strokeWidth={1.5}
                  width={24}
                  height={24}
                  color={textColor}
                />
              </View>
            </TouchableOpacity>
          )
        }
      />

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps='handled'>
        <View style={styles.container}>
          <Text style={[fontBold(18, textColor), {marginVertical: 20}]}>
            {registrationStep === 1
              ? 'Kindly let us know you more'
              : 'Sports Preferences'}
          </Text>

          {(() => {
            switch (registrationStep) {
              case 1:
                return (
                  <RegistrationGeneralDetails
                    formData={formData}
                    setFormData={setFormData}
                    setRegistrationStep={setRegistrationStep}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    isEditingProfile={params.isEditProfile}
                  />
                );

              case 2:
                return (
                  <ChooseSportsInterest
                    formData={formData}
                    selectedImage={selectedImage}
                    isEditingProfile={params.isEditProfile}
                  />
                );
            }
          })()}
        </View>
      </ScrollView>
    </PageContainer>
  );
};

type ChooseSportsInterestProps = {
  formData: RegisterFanFormData;
  selectedImage: ImageType | null;
  isEditingProfile: boolean | undefined;
};

const ChooseSportsInterest: React.FC<ChooseSportsInterestProps> = ({
  formData,
  selectedImage,
  isEditingProfile,
}) => {
  const {user} = useAppSelector(state => state.auth);
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      sportInterests: user?.sportInterests || [],
    },
  });

  const [uploadImagesToCloudinary, {isLoading: imageUploadCIP}] =
    useUploadImageMutation();

  const {data: appSettings} = useGetAppSettingsQuery();
  const {data: sports} = useGetAvailableSportsQuery();

  const [registerFan, {isLoading: registerFanCIP}] = useRegisterFanMutation();
  const [updateFan, {isLoading: updateFanCIP}] = useUpdateFanMutation();

  const [consentModalVisible, setConsentModalVisible] = useState(false);

  const textColor = useTextColor();

  const uploadToCloudinary = async () => {
    if (isEditingProfile && !selectedImage) {
      return user?.profilePicUrl || '';
    }

    if (selectedImage) {
      try {
        const uploadedImage = await uploadImagesToCloudinary({
          imageDataBase64: `data:image/jpg;base64,${selectedImage.data}`,
          uploadPreset: CloudinaryUploadPresets.PROFILE_PICS,
        }).unwrap();

        return uploadedImage.secure_url;
      } catch (error) {
        console.log('error', error);
      }
    }

    return '';
  };
  const onSubmit = async (data: {sportInterests: number[]}) => {
    try {
      const imageUrl = await uploadToCloudinary();

      const apiData: RegisterFanParams = {
        profilePicUrl: imageUrl ? imageUrl : '',
        fullName: formData.fullName as string,
        username: formData.username?.toLowerCase() as string,
        dob: formData.dob as string,
        gender: formData.gender as number,
        sportInterests: data.sportInterests,
      };

      if (isEditingProfile) {
        const {username, ...updatedData} = apiData;
        await updateFan(updatedData).unwrap();
        navigation.navigate(AccountSettingsPage);

        dispatch(
          updateToast({
            message: 'Profile updated successfully',
            isVisible: true,
          }),
        );
        return;
      }

      await registerFan(apiData).unwrap();
      navigation.reset({
        index: 0,
        routes: [{name: RecommendationsPage}],
      });
    } catch (error) {
      console.log(
        '-------xxxxxx----------Error while Fan details : FanRegistrationDetails.tsx',
        error,
      );
    }
  };
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          marginVertical: 26,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginLeft: -26,
        }}>
        <Image
          source={require('../../../assets/images/sports_preference.png')}
          style={{width: 230, height: 230}}
        />
      </View>

      <Text style={[fontBold(16, appColors.warmRed), {marginBottom: 26}]}>
        Which sports are you interested in?
      </Text>

      <View style={{marginBottom: 26}}>
        <Controller
          name='sportInterests'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Kindly select atleast one sport you are interested in',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <MultiItemSelector
              data={{...sports}}
              selectedItems={value || []}
              onItemSelected={sports => {
                onChange(sports);
              }}
              isValid={errors.sportInterests ? false : true}
              errorMessage={
                errors.sportInterests ? errors.sportInterests.message : ''
              }
            />
          )}
        />
      </View>

      <View style={{marginTop: 'auto'}}>
        <PulseEffect>
          <Button
            style={styles.submitButton}
            // onPress={handleSubmit(onSubmit)}
            onPress={() => {
              if (appSettings?.shouldTakeConsent && !isEditingProfile) {
                setConsentModalVisible(true);
              } else {
                handleSubmit(onSubmit)();
              }
            }}
            isLoading={imageUploadCIP || registerFanCIP || updateFanCIP}>
            {isEditingProfile ? 'Save Changes' : 'Done'}
          </Button>
        </PulseEffect>
      </View>

      {/*  to do : make user consent global state */}
      <CustomModal
        modalVisible={consentModalVisible}
        setModalVisible={setConsentModalVisible}
        modalHeading={`User's Consent`}>
        <View>
          <Text style={[fontRegular(15, textColor)]}>
            We collect your data and preferences to personalize your experience
            and to support advertising and marketing activities.
            {'\n'}
            {'\n'}
            {'\n'}
            By choosing "Allow", you agree to our use of this information as
            described in our Privacy Policy.
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
                setConsentModalVisible(false);
                handleSubmit(onSubmit)();
                dispatch(updateUserConsent(false));
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
              <Text style={fontBold(14, appColors.warmRed)}>Don't Allow</Text>
            </Button>

            <Button
              onPress={() => {
                setConsentModalVisible(false);
                handleSubmit(onSubmit)();
                dispatch(updateUserConsent(true));
              }}
              style={[styles.actionButton, {flex: 1}]}>
              <Text style={fontBold(14, appColors.white)}>Allow</Text>
            </Button>
          </View>
        </View>
      </CustomModal>
    </View>
  );
};

export default FanRegistrationDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  submitButton: {
    height: 48,
    borderRadius: BUTTON_BORDER_RADIUS,
    marginBottom: 20,
  },

  actionButton: {height: customHeight(48), borderRadius: BUTTON_BORDER_RADIUS},
});
