import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {Image as ImageType} from 'react-native-image-crop-picker';
import GeneralHeader from '../../../components/GeneralHeader';
import PageContainer from '../../../components/PageContainer';
import {RegistrationGeneralDetails} from '../../../components/RegistrationGeneralDetails';
import {fontBold} from '../../../styles/fonts';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {Controller, useForm} from 'react-hook-form';
import {CustomDropDown} from '../../../components/CustomDropDown';
import {useGetAvailableSportsQuery} from '../../../store/core/core.service';
import {DropDownItemType} from '../../../components/CustomDropDown/CustomDropDown';
import {PulseEffect} from '../../../components/PulseEffect';
import {Button} from 'native-base';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {appColors} from '../../../constants/colors';
import {MultiItemSelector} from '../../../components/MultiItemSelector';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {
  isValidFacebookProfileUrl,
  isValidInstagramProfileUrl,
  isValidTwitterProfileUrl,
  isValidWebsiteUrl,
} from '../../../utils/helpers/string';
import {AdditionalInfoIcon} from '../../../assets/icons';
import {CloudinaryUploadPresets} from '../../../constants/cloudinary';
import {useUploadImageMutation} from '../../../store/postFeed/postFeed.service';
import {MentorRootPage} from '../Root';
import {convertObjectIntoDropDownItemsArrayFormat} from '../../../utils/helpers/adapter';
import {useRegisterMentorMutation} from '../../../store/mentor/mentor.service';
import {MentorRoles} from '../../../constants/mentor';
import {RegisterMentorParams} from '../../../types/mentor/mentor.params';

export type RegisterMentorFormData = {
  profilePic?: ImageType | null;
  fullName?: string;
  username?: string;
  dob?: string;
  gender?: number;
  sportInterests?: number[];
  role?: number; // 1: FITNESS_TRAINER, 2: COACH, 3: SPORTS_PSYCHOLOGIST
  currentAffiliation?: string;
  yearsOfExperience?: string;
  website?: string;
  linkedIn?: string;
  fbLink?: string;
  instaLink?: string;
  xLink?: string;
  mentorBio?: string;
  primarySport?: number;
};

const MentorRegistrationDetails = () => {
  const navigation = useAppNavigation();

  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState<RegisterMentorFormData>({});
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const [uploadImagesToCloudinary, {isLoading: imageUploadCIP}] =
    useUploadImageMutation();

  const [registerMentor, {isLoading: registerMentorCIP}] =
    useRegisterMentorMutation();

  const textColor = useTextColor();

  const handleBackPress = () => {
    if (registrationStep > 1) {
      setRegistrationStep(registrationStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const getHeaderLine = () => {
    switch (registrationStep) {
      case 1:
        return 'Kindly let us know you more';
      case 2:
        return 'Sports & Profession';
      case 3:
        return 'About You & Experience';
      case 4:
        return 'Social Media Links';
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

    return '';
  };

  const submitForm = async (data: RegisterMentorFormData) => {
    try {
      // console.log('formData - submit - formdata', formData);
      // console.log('formData - submit  -data ', data);
      const imageUrl = await uploadToCloudinary();

      const apiData: RegisterMentorParams = {
        profilePicUrl: imageUrl ? imageUrl : '',
        fullName: data.fullName as string,
        username: data.username?.toLowerCase() as string,
        dob: data.dob as string,
        gender: data.gender as number,
        role: data.role as number,
        sportInterests: data.sportInterests as number[],
        yearsOfExperience: data.yearsOfExperience as string,
        bio: data.mentorBio as string,
        primarySport: data.primarySport as number,
        ...(data.website && {website: data.website}),
        ...(data.currentAffiliation && {
          currentAffiliation: data.currentAffiliation,
        }),
        ...(data.fbLink && {fbLink: data.fbLink}),
        ...(data.instaLink && {instaLink: data.instaLink}),
        ...(data.xLink && {xLink: data.xLink}),
      };
      await registerMentor(apiData).unwrap();
      navigation.reset({
        index: 0,
        routes: [{name: MentorRootPage}],
      });
    } catch (error) {
      console.log(
        '-------xxxxxx----------Error while Registering  Mentor : PlayerRegistrationDetails.tsx',
        error,
      );
    }
  };

  return (
    <PageContainer applyGradient>
      <GeneralHeader title='Mentor Details' backHandler={handleBackPress} />

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps='handled'>
        <View style={styles.container}>
          <Text style={[fontBold(18, textColor), {marginVertical: 20}]}>
            {getHeaderLine()}
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
                  <SportsExperience
                    formData={formData}
                    setFormData={setFormData}
                    setRegistrationStep={setRegistrationStep}
                  />
                );

              case 3:
                return (
                  <MentorBioAndExperience
                    formData={formData}
                    setFormData={setFormData}
                    setRegistrationStep={setRegistrationStep}
                  />
                );
              case 4:
                return (
                  <SocialMediaLinks
                    formData={formData}
                    setFormData={setFormData}
                    setRegistrationStep={setRegistrationStep}
                    onSubmitForm={submitForm}
                    submissionCIP={imageUploadCIP || registerMentorCIP}
                  />
                );
            }
          })()}
        </View>
      </ScrollView>
    </PageContainer>
  );
};

type MentorBioAndExperienceProps = {
  formData: RegisterMentorFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterMentorFormData>>;
  setRegistrationStep: React.Dispatch<React.SetStateAction<number>>;
};

type MentorBioAndExperienceFormData = {
  currentAffiliation: string;
  yearsOfExperience: string;
  mentorBio: string;
};

const MentorBioAndExperience: React.FC<MentorBioAndExperienceProps> = ({
  formData,
  setFormData,
  setRegistrationStep,
}) => {
  const textColor = useTextColor();
  const cardColor = useCardColor();
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      currentAffiliation: '',
      yearsOfExperience: '',
      mentorBio: '',
      website: '',
    },
  });

  const onSubmit = async (data: MentorBioAndExperienceFormData) => {
    try {
      setFormData(prev => ({
        ...prev,
        currentAffiliation: data.currentAffiliation,
        yearsOfExperience: data.yearsOfExperience,
        mentorBio: data.mentorBio,
      }));
      setRegistrationStep(4);
      return;
    } catch (error) {
      console.log(
        '-------xxxxxx----------Error while Player details : PlayerRegistrationDetails.tsx',
        error,
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View
        style={{
          marginVertical: 20,
          marginBottom: 36,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AdditionalInfoIcon
          width={130}
          height={130}
          color={textColor}
          style={{alignSelf: 'center'}}
        />
      </View>
      <View style={{marginBottom: 26}}>
        <Controller
          name='mentorBio'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Kindly enter your brief bio',
            },
            maxLength: {
              value: 500,
              message: 'Bio cannot exceed 500 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Mentor Bio'
              placeholder='Enter about yourself'
              value={value}
              maxLength={501}
              numberOfLines={5}
              onChangeText={onChange}
              autoCapitalize='sentences'
              height={'auto'}
              textAlignVertical='top'
              isValid={errors.mentorBio ? false : true}
              errorMessage={errors.mentorBio ? errors.mentorBio.message : ''}
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='currentAffiliation'
          control={control}
          rules={{
            maxLength: {
              value: 50,
              message: 'It cannot exceed 50 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Where are you currently affiliated or working?'
              placeholder='Enter your current affiliation (if any)'
              value={value}
              maxLength={51}
              onChangeText={onChange}
              isValid={errors.currentAffiliation ? false : true}
              errorMessage={
                errors.currentAffiliation
                  ? errors.currentAffiliation.message
                  : ''
              }
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='yearsOfExperience'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Kindly enter your years of experience',
            },
            pattern: {
              value: /^[0-9]+$/,
              message: 'Only numbers are allowed',
            },

            maxLength: {
              value: 2,
              message: 'It cannot exceed 2 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='How many years of experience do you have?'
              placeholder='Enter your experience'
              value={value}
              maxLength={3}
              keyboardType='numeric'
              onChangeText={text => {
                const numericValue = text.replace(/[^0-9]/g, '');
                onChange(numericValue);
              }}
              isValid={errors.yearsOfExperience ? false : true}
              errorMessage={
                errors.yearsOfExperience ? errors.yearsOfExperience.message : ''
              }
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='website'
          control={control}
          rules={{
            validate: {
              validUrl: value => (value ? isValidWebsiteUrl(value) : true),
            },
            maxLength: {
              value: 100,
              message: 'Link cannot exceed 100 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Personal or Professional Website Link'
              placeholder='https://www.mentor.com/'
              value={value}
              onChangeText={onChange}
              maxLength={101}
              autoCapitalize='none'
              isValid={errors.website ? false : true}
              errorMessage={errors.website ? errors.website.message : ''}
            />
          )}
        />
      </View>

      <View style={{marginTop: 'auto'}}>
        <PulseEffect>
          <Button
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
            // isLoading={imageUploadCIP || registerFanCIP}
          >
            Next
          </Button>
        </PulseEffect>
      </View>
    </View>
  );
};

type SocialMediaLinksProps = {
  formData: RegisterMentorFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterMentorFormData>>;
  setRegistrationStep: React.Dispatch<React.SetStateAction<number>>;
  onSubmitForm: (data: RegisterMentorFormData) => void;
  submissionCIP: boolean;
};

type SocialMediaLinksFormData = {
  fbLink: string | null;
  xLink: string | null;
  instaLink: string | null;
};

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  formData,
  setFormData,
  setRegistrationStep,
  onSubmitForm,
  submissionCIP,
}) => {
  const textColor = useTextColor();
  const cardColor = useCardColor();

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      fbLink: '',
      xLink: '',
      instaLink: '',
    },
  });

  const onSubmit = async (data: SocialMediaLinksFormData) => {
    try {
      console.log('data', data);

      onSubmitForm({
        ...formData,
        fbLink: data.fbLink as string,
        xLink: data.xLink as string,
        instaLink: data.instaLink as string,
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
          marginVertical: 20,
          marginBottom: 36,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../../assets/images/social_network.png')}
          style={{width: 200, height: 200}}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='fbLink'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Kindly enter your facebook profile link',
            },
            validate: {
              validUrl: value =>
                value ? isValidFacebookProfileUrl(value) : true,
            },
            maxLength: {
              value: 100,
              message: 'Link cannot exceed 100 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Facebook Profile Link'
              placeholder='https://www.facebook.com/yourprofile'
              value={value}
              autoCapitalize='none'
              onChangeText={onChange}
              maxLength={101}
              isValid={errors.fbLink ? false : true}
              errorMessage={errors.fbLink ? errors.fbLink.message : ''}
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='instaLink'
          control={control}
          rules={{
            // required: {
            //   value: true,
            //   message: 'Kindly enter your instagram profile link',
            // },
            validate: {
              validUrl: value =>
                value ? isValidInstagramProfileUrl(value) : true,
            },
            maxLength: {
              value: 100,
              message: 'Link cannot exceed 100 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Instagram Profile Link'
              placeholder='https://www.instagram.com/yourprofile'
              autoCapitalize='none'
              value={value}
              onChangeText={onChange}
              maxLength={101}
              isValid={errors.instaLink ? false : true}
              errorMessage={errors.instaLink ? errors.instaLink.message : ''}
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='xLink'
          control={control}
          rules={{
            validate: {
              validUrl: value =>
                value ? isValidTwitterProfileUrl(value) : true,
            },

            maxLength: {
              value: 100,
              message: 'Link cannot exceed 100 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='X Profile Link'
              placeholder='https://www.twitter.com/yourprofile'
              value={value}
              onChangeText={onChange}
              autoCapitalize='none'
              maxLength={101}
              isValid={errors.xLink ? false : true}
              errorMessage={errors.xLink ? errors.xLink.message : ''}
            />
          )}
        />
      </View>

      <View style={{marginTop: 'auto'}}>
        <PulseEffect>
          <Button
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
            isLoading={submissionCIP}>
            Done
          </Button>
        </PulseEffect>
      </View>
    </View>
  );
};

type SportsExperienceProps = {
  formData: RegisterMentorFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterMentorFormData>>;
  setRegistrationStep: React.Dispatch<React.SetStateAction<number>>;
};

type SportsExperienceFormData = {
  primarySport: DropDownItemType | null;
  role: DropDownItemType | null;
  sportInterests: number[];
};

const SportsExperience: React.FC<SportsExperienceProps> = ({
  formData,
  setFormData,
  setRegistrationStep,
}) => {
  const {data: sports} = useGetAvailableSportsQuery();
  const navigation = useAppNavigation();

  const textColor = useTextColor();
  const cardColor = useCardColor();
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      primarySport: null, // number
      role: null, // number
      sportInterests: [],
    },
  });

  const sportsList = useMemo(() => {
    return convertObjectIntoDropDownItemsArrayFormat(sports || {});
  }, [sports]); // Only recalculate when sports data changes

  const onSubmit = async (data: SportsExperienceFormData) => {
    try {
      // console.log('data', data);
      setFormData(prev => ({
        ...prev,
        primarySport: data.primarySport?.value as number,
        role: data.role?.value as number,
        sportInterests: data.sportInterests,
      }));

      setRegistrationStep(3);
      return;
    } catch (error) {
      console.log(
        '-------xxxxxx----------Error while Player details : PlayerRegistrationDetails.tsx',
        error,
      );
    }
  };

  return (
    <>
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
          style={{width: 190, height: 190}}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='role'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Kindly select one role',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomDropDown
              label='What best describes your professional role?'
              customLabelStyles={{
                marginTop: 4,
              }}
              buttonTitle='Select Your Role'
              sheetTitle='Select 1 Professional Role '
              data={convertObjectIntoDropDownItemsArrayFormat(MentorRoles)}
              selectedItem={value}
              onItemSelect={onChange}
              snapPoints={['30%']}
              style={{
                buttonBackgroundColor: cardColor,
                buttonTextColor: textColor,
                buttonJustifyContent: 'space-between',
                buttonBorderWidth: 0.5,
                buttonBorderColor: appColors.gray,
                buttonPaddingVertical: 16,
                buttonrightIconSize: 12,
              }}
              isValid={errors.role ? false : true}
              errorMessage={errors.role ? errors.role.message : ''}
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='primarySport'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Kindly select your primary sport',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomDropDown
              label=" What's Your primary sport ?"
              customLabelStyles={{
                marginTop: 4,
              }}
              snapPoints={['50%', '75%']}
              buttonTitle='Select Sport'
              sheetTitle='Select 1 Primary Sport '
              data={sportsList}
              selectedItem={value}
              onItemSelect={onChange}
              style={{
                buttonBackgroundColor: cardColor,
                buttonTextColor: textColor,
                buttonJustifyContent: 'space-between',
                buttonBorderWidth: 0.5,
                buttonBorderColor: appColors.gray,
                buttonPaddingVertical: 16,
                buttonrightIconSize: 12,
              }}
              isValid={errors.primarySport ? false : true}
              errorMessage={
                errors.primarySport ? errors.primarySport.message : ''
              }
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Text style={[fontBold(14, textColor), {marginBottom: 18}]}>
          Any other sport you play or are Interested In ?
        </Text>
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
            onPress={handleSubmit(data => {
              onSubmit({
                primarySport: data.primarySport,
                role: data.role,
                sportInterests: data.sportInterests,
              });
            })}
            // isLoading={imageUploadCIP || registerFanCIP}
          >
            Done
          </Button>
        </PulseEffect>
      </View>
    </>
  );
};

export default MentorRegistrationDetails;

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
