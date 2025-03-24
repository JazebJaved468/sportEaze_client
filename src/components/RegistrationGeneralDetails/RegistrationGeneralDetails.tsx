import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {RegisterFanFormData} from '../../modules/Fan/FanRegistrationDetails/FanRegistrationDetails';
import {RegisterPlayerFormData} from '../../modules/Player/PlayerRegistrationDetails/PlayerRegistrationDetails';
import {useForm, Controller} from 'react-hook-form';
import {CameraIcon, UserPlaceholderIcon} from '../../assets/icons';
import {appColors} from '../../constants/colors';
import {useTextColor} from '../../utils/customHooks/colorHooks';
import {useAppSelector} from '../../utils/customHooks/storeHooks';
import {
  openImageCamera,
  openImagePicker,
} from '../../utils/helpers/mediaPicker';
import {prefixWithAtSymbol} from '../../utils/helpers/string';
import {CustomTextInputField} from '../CustomInputField';
import {DateTimePicker} from '../DateTimePicker';
import {GenderPicker} from '../GenderPicker';
import {PulseEffect} from '../PulseEffect';

import {Image as ImageType} from 'react-native-image-crop-picker';
import {Button, View} from 'native-base';
import {BUTTON_BORDER_RADIUS} from '../../constants/styles';
type RegistrationGeneralDetailsProps = {
  setRegistrationStep: Dispatch<SetStateAction<number>>;
  setFormData: Dispatch<
    SetStateAction<RegisterFanFormData | RegisterPlayerFormData>
  >;
  formData: RegisterFanFormData | RegisterPlayerFormData;
  selectedImage: ImageType | null;
  setSelectedImage: Dispatch<SetStateAction<ImageType | null>>;
};

type GeneralDetailsFormData = {
  fullName: string;
  username: string;
  dob: string;
  gender: number;
};

const RegistrationGeneralDetails: React.FC<RegistrationGeneralDetailsProps> = ({
  setRegistrationStep,
  setFormData,
  formData,
  selectedImage,
  setSelectedImage,
}) => {
  const {user} = useAppSelector(state => state.auth);

  const textColor = useTextColor();

  const {
    handleSubmit,
    control,

    formState: {errors},
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || formData.fullName || '',
      username: user?.username || formData.username || '',
      dob: formData.dob || (undefined as string | undefined),
      gender: formData.gender as number | undefined,
    },
  });

  const onSubmit = async (data: GeneralDetailsFormData) => {
    try {
      console.log('data', data);
      setFormData(prev => ({
        ...prev,
        ...data,
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
            pattern: {
              value: /^@[a-zA-Z0-9_]+$/,
              message:
                'Username can only contain letters, numbers, and underscores',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Username'
              placeholder='Enter your Username'
              maxLength={51}
              autoCapitalize='none'
              value={value}
              onChangeText={val => {
                // Extract the actual username content (without @)
                const contentWithoutSymbol = val.startsWith('@')
                  ? val.substring(1)
                  : val;

                // Filter out invalid characters
                const filteredContent = contentWithoutSymbol.replace(
                  /[^a-zA-Z0-9_]/g,
                  '',
                );

                // Only add @ if we have content
                const formattedUsername = filteredContent
                  ? `@${filteredContent}`
                  : '';

                onChange(formattedUsername);
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

export default RegistrationGeneralDetails;

const styles = StyleSheet.create({
  submitButton: {
    height: 48,
    borderRadius: BUTTON_BORDER_RADIUS,
    marginBottom: 20,
  },
});
