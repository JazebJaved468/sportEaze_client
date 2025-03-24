import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
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
import {SportsPreferenceSelector} from '../../../components/SportsPreferenceSelector';
import {fontBold} from '../../../styles/fonts';
import {RegisterFanParams} from '../../../types/fan/fan.params';
import {RecommendationsPage} from '../Recommendations';
import {RegistrationGeneralDetails} from '../../../components/RegistrationGeneralDetails';

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
      <GeneralHeader title='Fan Details' backHandler={handleBackPress} />

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
                  />
                );

              case 2:
                return (
                  <ChooseSportsInterest
                    formData={formData}
                    selectedImage={selectedImage}
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
};

const ChooseSportsInterest: React.FC<ChooseSportsInterestProps> = ({
  formData,
  selectedImage,
}) => {
  const navigation = useAppNavigation();
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      sportInterests: [],
    },
  });

  const [uploadImagesToCloudinary, {isLoading: imageUploadCIP}] =
    useUploadImageMutation();

  const [registerFan, {isLoading: registerFanCIP}] = useRegisterFanMutation();

  const uploadToCloudinary = async () => {
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
            <SportsPreferenceSelector
              selectedSports={value || []}
              onSportsSelected={sports => {
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
            onPress={handleSubmit(onSubmit)}
            isLoading={imageUploadCIP || registerFanCIP}>
            Done
          </Button>
        </PulseEffect>
      </View>
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
});
