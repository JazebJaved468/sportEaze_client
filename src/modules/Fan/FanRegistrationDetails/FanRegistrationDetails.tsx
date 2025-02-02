import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {useTextColor} from '../../../utils/customHooks/colorHooks';
import {Button} from 'native-base';
import {Controller, useForm} from 'react-hook-form';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {
  CalenderIcon,
  CameraIcon,
  MaleIcon,
  UserPlaceholderIcon,
} from '../../../assets/icons';
import {DateTimePicker} from '../../../components/DateTimePicker';
import {format} from 'date-fns';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GenderPicker} from '../../../components/GenderPicker';
import {appColors} from '../../../constants/colors';
import {ImageOrVideo, Image as ImageType} from 'react-native-image-crop-picker';
import {POST_IMAGES_LIMIT} from '../../../constants/media';
import {
  openImageCamera,
  openImagePicker,
} from '../../../utils/helpers/mediaPicker';
import {useUploadImageMutation} from '../../../store/postFeed/postFeed.service';
import {useDidUpdateEffect} from '../../../utils/customHooks/customHooks';
import {CloudinaryUploadPresets} from '../../../constants/cloudinary';
import {useAppDispatch} from '../../../utils/customHooks/storeHooks';
import {updateToast} from '../../../store/core/core.slice';
import {useUpdateUserMutation} from '../../../store/auth/auth.service';

const FanRegistrationDetails = () => {
  const dispatch = useAppDispatch();

  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const [uploadImagesToCloudinary, {isLoading: imageUploadCIP}] =
    useUploadImageMutation();

  const [updateUser, {isLoading: updateUserCIP}] = useUpdateUserMutation();

  const textColor = useTextColor();

  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: 'jazeb',
      dob: undefined as string | undefined,
      gender: undefined as string | undefined,
    },
  });

  type FormData = {
    name: string;
    dob: string;
    gender: string;
  };

  const onSubmit = async (data: FormData) => {
    try {
      console.log('data', data);

      const imageUrl = await uploadToCloudinary();

      const apiData = {
        ...data,
        gender: data.gender === 'male' ? 'Male' : 'Female',
        profilePicUrl: imageUrl ? imageUrl : null,
      };

      await updateUser(apiData);
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
  };

  return (
    <PageContainer applyGradient>
      <GeneralHeader title='Details' />

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps='handled'>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 16,
              marginVertical: 20,
              color: textColor,
            }}>
            Kindly let us know you more
          </Text>

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
                  borderRadius: 10,
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
                  <UserPlaceholderIcon
                    width={100}
                    height={100}
                    color={textColor}
                  />
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
              name='name'
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
                  isValid={errors.name ? false : true}
                  errorMessage={errors.name ? errors.name.message : ''}
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

          <Button
            style={{
              height: 48,
              borderRadius: BUTTON_BORDER_RADIUS,
              marginBottom: 20,
              marginTop: 'auto',
            }}
            onPress={handleSubmit(data => {
              onSubmit({
                name: data.name,
                dob: data.dob as string,
                gender: data.gender as string,
              });
            })}
            isLoading={imageUploadCIP || updateUserCIP}>
            Next
          </Button>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

export default FanRegistrationDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
