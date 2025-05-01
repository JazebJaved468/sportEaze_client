import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {Image as ImageType} from 'react-native-image-crop-picker';
import {useUploadImageMutation} from '../../../store/postFeed/postFeed.service';
import {PatronRootPage} from '../Root';
import {RegisterPatronParams} from '../../../types/patron/patron.params';
import {FundingType, PatronType} from '../../../constants/enums';
import {useRegisterPatronMutation} from '../../../store/patron/patron.service';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {CloudinaryUploadPresets} from '../../../constants/cloudinary';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {fontBold} from '../../../styles/fonts';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {PulseEffect} from '../../../components/PulseEffect';
import {Button} from 'native-base';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {Controller, useForm} from 'react-hook-form';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';
import {
  openImageCamera,
  openImagePicker,
} from '../../../utils/helpers/mediaPicker';
import {appColors} from '../../../constants/colors';
import {CameraIcon, UserPlaceholderIcon} from '../../../assets/icons';
import {
  isValidFacebookProfileUrl,
  isValidInstagramProfileUrl,
  isValidLinkedinProfileUrl,
  isValidTwitterProfileUrl,
  isValidWebsiteUrl,
} from '../../../utils/helpers/string';
import {DropDownItemType} from '../../../components/CustomDropDown/CustomDropDown';
import {useGetAvailableSportsQuery} from '../../../store/core/core.service';
import {convertObjectIntoDropDownItemsArrayFormat} from '../../../utils/helpers/adapter';
import {MultiItemSelector} from '../../../components/MultiItemSelector';
import {customHeight} from '../../../styles/responsiveStyles';
import {playerLevels} from '../../../constants/player';
import {WaitingforApprovalPage} from '../WaitingForApproval';

export type RegisterPatronFormData = {
  profilePic?: ImageType | null;
  fullName?: string;
  username?: string;
  fbLink?: string;
  instaLink?: string;
  xLink?: string;
  industryType?: string;
  supportedSports?: number[];
  preferredPlayerLevels?: number[];
  website?: string;
  linkedIn?: string;
};

const PatronRegistrationDetails = () => {
  const navigation = useAppNavigation();

  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState<RegisterPatronFormData>({});
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const [uploadImagesToCloudinary, {isLoading: imageUploadCIP}] =
    useUploadImageMutation();

  const [registerPatron, {isLoading: registerPatronCIP}] =
    useRegisterPatronMutation();

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
        return 'Kindly let us know about Your Organiztion';
      case 2:
        return 'Sports and Player Preferences';
      //   case 3:
      //     return 'About You & Sponsorship';
      case 4:
        return 'Online Presence';
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

  const submitForm = async (data: RegisterPatronFormData) => {
    try {
      // console.log('formData - submit - formdata', formData);
      // console.log('formData - submit  -data ', data);
      const imageUrl = await uploadToCloudinary();

      const apiData: RegisterPatronParams = {
        profilePicUrl: imageUrl ? imageUrl : '',
        fullName: data.fullName as string,
        username: data.username?.toLowerCase() as string,
        patronType: PatronType.INDIVIDUAL,
        industryType: data.industryType as string,
        supportedSports: data.supportedSports as number[],
        preferredPlayerLevels: data.preferredPlayerLevels as number[],
        preferredFundingTypes: [
          FundingType.FULL_SPONSORSHIP,
          FundingType.PARTIAL_SPONSORSHIP,
        ],
        website: data.website as string,
        linkedIn: data.linkedIn as string,
        ...(data.fbLink && {fbLink: data.fbLink}),
        ...(data.linkedIn && {linkedIn: data.linkedIn}),
        ...(data.instaLink && {instaLink: data.instaLink}),
        ...(data.xLink && {xLink: data.xLink}),
      };
      await registerPatron(apiData).unwrap();
      navigation.reset({
        index: 0,
        routes: [{name: WaitingforApprovalPage}],
      });
    } catch (error) {
      console.log(
        '-------xxxxxx----------Error while Registering  Patron : PatronRegistrationDetails.tsx',
        error,
      );
    }
  };
  return (
    <PageContainer applyGradient>
      <GeneralHeader title='Patron Details' backHandler={handleBackPress} />

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps='handled'>
        <View style={styles.container}>
          <Text
            style={[
              fontBold(18, textColor),
              {marginVertical: customHeight(20)},
            ]}>
            {getHeaderLine()}
          </Text>

          {(() => {
            switch (registrationStep) {
              case 1:
                return (
                  <PatronRegistrationGeneralDetails
                    formData={formData}
                    setFormData={setFormData}
                    setRegistrationStep={setRegistrationStep}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                  />
                );

              case 2:
                return (
                  //   <></>
                  <SportsExperience
                    formData={formData}
                    setFormData={setFormData}
                    setRegistrationStep={setRegistrationStep}
                  />
                );

              case 3:
                return (
                  <SocialMediaLinks
                    formData={formData}
                    setFormData={setFormData}
                    setRegistrationStep={setRegistrationStep}
                    onSubmitForm={submitForm}
                    submissionCIP={imageUploadCIP || registerPatronCIP}
                  />
                );
            }
          })()}
        </View>
      </ScrollView>
    </PageContainer>
  );
};

// start

type PatronRegistrationGeneralDetailsProps = {
  setRegistrationStep: Dispatch<SetStateAction<number>>;
  setFormData: Dispatch<SetStateAction<RegisterPatronFormData>>;
  formData: RegisterPatronFormData;
  selectedImage: ImageType | null;
  setSelectedImage: Dispatch<SetStateAction<ImageType | null>>;
  isEditingProfile?: boolean;
};

type PatronGeneralDetailsFormData = {
  fullName: string;
  username: string;
  industryType: string;
  website: string;
};

const PatronRegistrationGeneralDetails: React.FC<
  PatronRegistrationGeneralDetailsProps
> = ({
  setRegistrationStep,
  setFormData,
  formData,
  selectedImage,
  setSelectedImage,
  isEditingProfile = false,
}) => {
  const {user} = useAppSelector(state => state.auth);

  const textColor = useTextColor();

  const {
    handleSubmit,
    control,
    setError,
    formState: {errors},
  } = useForm({
    defaultValues: {
      fullName: formData.fullName || '',
      username: formData.username || '',
      industryType: formData.industryType || '',
      website: formData.website || 'https://www.instagram.com/yourprofile',
      pic: ' ',
    },
  });

  const onSubmit = async (data: PatronGeneralDetailsFormData) => {
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
        '-------xxxxxx----------Error while Patron details : PatronRegistrationDetails.tsx',
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
            {isEditingProfile &&
            user?.profilePicUrl &&
            selectedImage === null ? (
              <Image
                source={{uri: user.profilePicUrl}}
                style={{width: 140, height: 140}}
              />
            ) : isEditingProfile &&
              user?.profilePicUrl &&
              selectedImage !== null ? (
              <Image
                source={{uri: selectedImage.path}}
                style={{width: 140, height: 140}}
              />
            ) : selectedImage === null ? (
              <UserPlaceholderIcon width={90} height={90} color={textColor} />
            ) : (
              <Image
                source={{uri: selectedImage.path}}
                style={{width: 140, height: 140}}
              />
            )}

            {/* {selectedImage === null ? (
              <UserPlaceholderIcon width={90} height={90} color={textColor} />
            ) : (
              <Image
                source={{uri: selectedImage.path}}
                style={{width: 140, height: 140}}
              />
            )} */}
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
              message: 'Organization Name is required',
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
              label='Organization Name'
              placeholder='Enter your organization / company / club name'
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
              placeholder='@oragnization_name'
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
              isReadOnly={isEditingProfile}
              isValid={errors.username ? false : true}
              errorMessage={errors.username ? errors.username.message : ''}
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='industryType'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Industry Name is required',
            },
            minLength: {
              value: 3,
              message: 'It be atleast 3 characters long',
            },
            maxLength: {
              value: 50,
              message: 'Industry cannot exceed 50 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Industry your organization operates in'
              placeholder='e.g. Sportswear / Media / Finance'
              value={value}
              maxLength={51}
              onChangeText={onChange}
              isValid={errors.industryType ? false : true}
              errorMessage={
                errors.industryType ? errors.industryType.message : ''
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
            required: {
              value: true,
              message: 'Portfolio is required',
            },
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
              label='Professional Portfolio Link'
              placeholder='https://www.portfolio.com/'
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
            onPress={handleSubmit(data => {
              onSubmit({
                fullName: data.fullName,
                username: data.username,
                industryType: data.industryType as string,
                website: data.website as string,
              });
            })}>
            Next
          </Button>
        </PulseEffect>
      </View>
    </View>
  );
};

// end

// start
type SportsExperienceProps = {
  formData: RegisterPatronFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterPatronFormData>>;
  setRegistrationStep: React.Dispatch<React.SetStateAction<number>>;
};

type SportsExperienceFormData = {
  preferredPlayerLevels: number[];
  supportedSports: number[];
};

const SportsExperience: React.FC<SportsExperienceProps> = ({
  formData,
  setFormData,
  setRegistrationStep,
}) => {
  const {data: sports} = useGetAvailableSportsQuery();
  const navigation = useAppNavigation();

  const textColor = useTextColor();
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      preferredPlayerLevels: formData.preferredPlayerLevels || [],
      supportedSports: formData.supportedSports || [],
    },
  });

  const onSubmit = async (data: SportsExperienceFormData) => {
    try {
      // console.log('data', data);
      setFormData(prev => ({
        ...prev,

        supportedSports: data.supportedSports,
        preferredPlayerLevels: data.preferredPlayerLevels,
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
        <Text style={[fontBold(14, textColor), {marginBottom: 18}]}>
          Choose the player levels you prefer to work with.
        </Text>
        <Controller
          name='preferredPlayerLevels'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Kindly select atleast one player level',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <MultiItemSelector
              data={playerLevels}
              selectedItems={value || []}
              onItemSelected={level => {
                onChange(level);
              }}
              isValid={errors.supportedSports ? false : true}
              errorMessage={
                errors.supportedSports ? errors.supportedSports.message : ''
              }
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Text style={[fontBold(14, textColor), {marginBottom: 18}]}>
          Select the sports you support or are interested in.
        </Text>
        <Controller
          name='supportedSports'
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
              isValid={errors.supportedSports ? false : true}
              errorMessage={
                errors.supportedSports ? errors.supportedSports.message : ''
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
                supportedSports: data.supportedSports,
                preferredPlayerLevels: data.preferredPlayerLevels,
              });
            })}>
            Done
          </Button>
        </PulseEffect>
      </View>
    </>
  );
};
// end

// start

type SocialMediaLinksProps = {
  formData: RegisterPatronFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterPatronFormData>>;
  setRegistrationStep: React.Dispatch<React.SetStateAction<number>>;
  onSubmitForm: (data: RegisterPatronFormData) => void;
  submissionCIP: boolean;
};

type SocialMediaLinksFormData = {
  fbLink: string | null;
  xLink: string | null;
  instaLink: string | null;
  linkedIn: string | null;
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
      fbLink: 'https://www.facebook.com/yourprofile',
      xLink: '',
      instaLink: 'https://www.instagram.com/yourprofile',
      linkedIn: 'https://www.linkedin.com/in/muhammad-jazeb-javed-9472ab225/',
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
        linkedIn: data.linkedIn as string,
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
          //   marginVertical: 20,
          marginTop: customHeight(-20),
          marginBottom: customHeight(46),
          justifyContent: 'center',
          alignItems: 'center',
          //   backgroundColor: 'red',
        }}>
        <Image
          source={require('../../../assets/images/social_network.png')}
          style={{width: 200, height: 200}}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='linkedIn'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Kindly enter your Linkedin profile link',
            },
            validate: {
              validUrl: value =>
                value ? isValidLinkedinProfileUrl(value) : true,
            },
            maxLength: {
              value: 100,
              message: 'Link cannot exceed 100 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Linkedin Profile Link'
              placeholder='https://www.linkedin.com/yourprofile'
              value={value}
              autoCapitalize='none'
              onChangeText={onChange}
              maxLength={101}
              isValid={errors.linkedIn ? false : true}
              errorMessage={errors.linkedIn ? errors.linkedIn.message : ''}
            />
          )}
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
            required: {
              value: true,
              message: 'Kindly enter your instagram profile link',
            },
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
// end

export default PatronRegistrationDetails;

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
