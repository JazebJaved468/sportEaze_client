import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';

import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {useTextColor} from '../../../utils/customHooks/colorHooks';
import {Button} from 'native-base';
import {Controller, useForm} from 'react-hook-form';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {CameraIcon, UserPlaceholderIcon} from '../../../assets/icons';
import {DateTimePicker} from '../../../components/DateTimePicker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GenderPicker} from '../../../components/GenderPicker';
import {appColors} from '../../../constants/colors';
import {Image as ImageType} from 'react-native-image-crop-picker';
import {
  openImageCamera,
  openImagePicker,
} from '../../../utils/helpers/mediaPicker';
import {useUploadImageMutation} from '../../../store/postFeed/postFeed.service';
import {CloudinaryUploadPresets} from '../../../constants/cloudinary';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../utils/customHooks/storeHooks';
import {prefixWithAtSymbol} from '../../../utils/helpers/string';
import {useRegisterFanMutation} from '../../../store/fan/fan.service';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {PulseEffect} from '../../../components/PulseEffect';
import {SportsPreferenceSelector} from '../../../components/SportsPreferenceSelector';
import {fontBold} from '../../../styles/fonts';
import {RegisterFanParams} from '../../../types/fan/fan.params';

type RegisterFanFormData = {
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
                  <GeneralDetails
                    formData={formData}
                    setFormData={setFormData}
                    setRegistrationStep={setRegistrationStep}
                  />
                );

              case 2:
                return <ChooseSportsInterest formData={formData} />;
            }
          })()}
        </View>
      </ScrollView>
    </PageContainer>
  );
};

type GeneralDetailsFormData = {
  fullName: string;
  username: string;
  dob: string;
  gender: number;
};

type GeneralDetailsProps = {
  setRegistrationStep: Dispatch<SetStateAction<number>>;
  setFormData: Dispatch<SetStateAction<RegisterFanFormData>>;
  formData: RegisterFanFormData;
};

const GeneralDetails: React.FC<GeneralDetailsProps> = ({
  setRegistrationStep,
  setFormData,
}) => {
  const {user} = useAppSelector(state => state.auth);

  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const textColor = useTextColor();

  const {
    handleSubmit,
    control,

    formState: {errors},
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      username: user?.username || '',
      dob: undefined as string | undefined,
      gender: undefined as number | undefined,
    },
  });

  const onSubmit = async (data: GeneralDetailsFormData) => {
    try {
      console.log('data', data);
      setFormData(prev => ({
        ...prev,
        ...data,
        profilePic: selectedImage,
      }));
      setRegistrationStep(2);
      return;
    } catch (error) {
      console.log(
        '-------xxxxxx----------Error while Fan details : FanRegistrationDetails.tsx',
        error,
      );
    }
  };

  const selectImage = async ({
    useCamera = false, // By Default Gallery will open
  }: {
    useCamera?: boolean;
  }) => {
    const image = useCamera
      ? await openImageCamera()
      : await openImagePicker(false);

    if (image.length > 0) {
      setSelectedImage(image[0]);
    }
  };

  return (
    <View style={{flex: 1}}>
      {/* Profile Pic  */}
      <TouchableOpacity
        onPress={async () => {
          await selectImage({useCamera: false});
        }}
        activeOpacity={0.5}>
        <View
          style={{
            marginBottom: 26,

            alignSelf: 'center',
            width: 160,
            height: 160,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              zIndex: 1,
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 8,
              backgroundColor: appColors.warmRed,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CameraIcon width={16} height={16} color={appColors.white} />
          </View>

          <View
            style={{
              backgroundColor: appColors.whisperGray,
              width: 140,
              height: 140,
              borderRadius: 200,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            {selectedImage === null ? (
              <UserPlaceholderIcon width={100} height={100} color={textColor} />
            ) : (
              <Image
                source={{uri: selectedImage.path}}
                style={{width: 140, height: 140}}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Name Wrapper */}
      <View style={{marginBottom: 26}}>
        <Controller
          name='fullName'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Name is required',
            },
            minLength: {
              value: 3,
              message: 'Name must be atleast 3 characters long',
            },
            maxLength: {
              value: 50,
              message: 'Name cannot exceed 50 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Name'
              placeholder='Enter your name'
              maxLength={51}
              autoCapitalize='words'
              value={value}
              onChangeText={onChange}
              isValid={errors.fullName ? false : true}
              errorMessage={errors.fullName ? errors.fullName.message : ''}
            />
          )}
        />
      </View>

      {/* UserName Wrapper */}
      <View style={{marginBottom: 26}}>
        <Controller
          name='username'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Username is required',
            },
            minLength: {
              value: 4,
              message: 'Username must be atleast 3 characters long',
            },
            maxLength: {
              value: 50,
              message: 'Username cannot exceed 50 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Username'
              placeholder='Enter your Username'
              maxLength={51}
              autoCapitalize='words'
              value={value}
              onChangeText={val => {
                const formattedUsername = prefixWithAtSymbol(val);
                onChange(formattedUsername); // Add @ symbol to username
              }}
              isValid={errors.username ? false : true}
              errorMessage={errors.username ? errors.username.message : ''}
            />
          )}
        />
      </View>

      {/* DOB Wrapper */}
      <View style={{marginBottom: 26}}>
        <Controller
          name='dob'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Date Of Birth is required',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <DateTimePicker
              label='Date Of Birth'
              onSelectDate={val => {
                onChange(val);
              }}
              value={value}
              isValid={errors.dob ? false : true}
              errorMessage={errors.dob ? errors.dob.message : ''}
            />
          )}
        />
      </View>

      {/* Gender Wrapper */}
      <View style={{marginBottom: 26}}>
        <Controller
          name='gender'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Gender is required',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <GenderPicker
              label='Gender'
              selectedGender={value}
              setSelectedGender={onChange}
              isValid={errors.gender ? false : true}
              errorMessage={errors.gender ? errors.gender.message : ''}
            />
          )}
        />
      </View>

      <View style={{marginTop: 'auto'}}>
        <PulseEffect>
          <Button
            style={styles.submitButton}
            onPress={handleSubmit(data => {
              onSubmit({
                fullName: data.fullName,
                username: data.username,
                dob: data.dob as string,
                gender: data.gender as number,
              });

              setRegistrationStep(2);
            })}>
            Next
          </Button>
        </PulseEffect>
      </View>
    </View>
  );
};

type ChooseSportsInterestProps = {
  formData: RegisterFanFormData;
};

const ChooseSportsInterest: React.FC<ChooseSportsInterestProps> = ({
  formData,
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
    if (formData.profilePic) {
      try {
        const uploadedImage = await uploadImagesToCloudinary({
          imageDataBase64: `data:image/jpg;base64,${formData.profilePic.data}`,
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

      const res = await registerFan(apiData).unwrap();
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
                console.log('sports', sports);
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
            onPress={handleSubmit(data => {
              onSubmit({
                // fullName: data.fullName,
                // username: data.username,
                // dob: data.dob as string,
                // gender: data.gender as number,
                sportInterests: data.sportInterests,
              });
            })}
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
