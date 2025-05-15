import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {Image as ImageType} from 'react-native-image-crop-picker';
import GeneralHeader from '../../../components/GeneralHeader';
import PageContainer from '../../../components/PageContainer';
import {RegistrationGeneralDetails} from '../../../components/RegistrationGeneralDetails';
import {fontBold, fontRegular} from '../../../styles/fonts';
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
import {Button, Switch} from 'native-base';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {appColors} from '../../../constants/colors';
import {playerLevels} from '../../../constants/player';
import {MultiItemSelector} from '../../../components/MultiItemSelector';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {
  isValidFacebookProfileUrl,
  isValidInstagramProfileUrl,
  isValidTwitterProfileUrl,
} from '../../../utils/helpers/string';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AdditionalInfoIcon} from '../../../assets/icons';
import {CloudinaryUploadPresets} from '../../../constants/cloudinary';
import {useUploadImageMutation} from '../../../store/postFeed/postFeed.service';
import {useRegisterFanMutation} from '../../../store/fan/fan.service';
import {useRegisterPlayerMutation} from '../../../store/player/player.service';
import {RegisterPlayerParams} from '../../../types/player/player.params';
import {PlayerRootPage} from '../Root';
import {convertObjectIntoDropDownItemsArrayFormat} from '../../../utils/helpers/adapter';

export type RegisterPlayerFormData = {
  profilePic?: ImageType | null;
  fullName?: string;
  username?: string;
  dob?: string;
  gender?: number;
  secondarySports?: number[];
  primarySport?: number;
  playingLevel?: number;
  currentTeam?: string;
  coachName?: string;
  playerBio?: string;
  trainingLocation?: string;
  fbLink?: string;
  instaLink?: string;
  xLink?: string;
  availableForSponsorship?: boolean;
};

const PlayerRegistrationDetails = () => {
  const navigation = useAppNavigation();

  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState<RegisterPlayerFormData>({});
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const [uploadImagesToCloudinary, {isLoading: imageUploadCIP}] =
    useUploadImageMutation();

  const [registerPlayer, {isLoading: registerPlayerCIP}] =
    useRegisterPlayerMutation();

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
        return 'Sports & Experience';
      case 3:
        return 'About You & Sponsorship';
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

  const submitForm = async (data: RegisterPlayerFormData) => {
    try {
      // console.log('formData - submit - formdata', formData);
      // console.log('formData - submit  -data ', data);
      const imageUrl = await uploadToCloudinary();

      const apiData: RegisterPlayerParams = {
        profilePicUrl: imageUrl ? imageUrl : '',
        fullName: data.fullName as string,
        username: data.username?.toLowerCase() as string,
        dob: data.dob as string,
        gender: data.gender as number,
        primarySport: data.primarySport as number,
        secondarySports: data.secondarySports as number[],
        availableForSponsorship: data.availableForSponsorship as boolean,
        playingLevel: data.playingLevel as number,
        playerBio: data.playerBio as string,
        ...(data.currentTeam && {currentTeam: data.currentTeam}),
        ...(data.coachName && {coachName: data.coachName}),
        ...(data.fbLink && {fbLink: data.fbLink}),
        ...(data.instaLink && {instaLink: data.instaLink}),
        ...(data.xLink && {xLink: data.xLink}),
      };
      await registerPlayer(apiData).unwrap();
      navigation.reset({
        index: 0,
        routes: [{name: PlayerRootPage}],
      });
    } catch (error) {
      console.log(
        '-------xxxxxx----------Error while Registering  Player : PlayerRegistrationDetails.tsx',
        error,
      );
    }
  };

  return (
    <PageContainer applyGradient>
      <GeneralHeader title='Player Details' backHandler={handleBackPress} />

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
                  <PlayerBioAndSponsorship
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
                    submissionCIP={imageUploadCIP || registerPlayerCIP}
                  />
                );
            }
          })()}
        </View>
      </ScrollView>
    </PageContainer>
  );
};

type PlayerBioAndSponsorshipProps = {
  formData: RegisterPlayerFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterPlayerFormData>>;
  setRegistrationStep: React.Dispatch<React.SetStateAction<number>>;
};

type PlayerBioAndSponsorshipFormData = {
  currrentTeam: string;
  coachName: string;
  playerBio: string;
  availableForSponsorship: boolean;
};

const PlayerBioAndSponsorship: React.FC<PlayerBioAndSponsorshipProps> = ({
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
      currrentTeam: '',
      coachName: '',
      playerBio: '',
      availableForSponsorship: true,
    },
  });

  const onSubmit = async (data: PlayerBioAndSponsorshipFormData) => {
    try {
      setFormData(prev => ({
        ...prev,
        currentTeam: data.currrentTeam,
        coachName: data.coachName,
        playerBio: data.playerBio,
        availableForSponsorship: data.availableForSponsorship,
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
          name='playerBio'
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
              label='Player Bio'
              placeholder='Enter about yourself'
              value={value}
              maxLength={501}
              numberOfLines={5}
              onChangeText={onChange}
              autoCapitalize='sentences'
              height={'auto'}
              textAlignVertical='top'
              isValid={errors.playerBio ? false : true}
              errorMessage={errors.playerBio ? errors.playerBio.message : ''}
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='currrentTeam'
          control={control}
          rules={{
            maxLength: {
              value: 50,
              message: 'Team name cannot exceed 50 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Which team do you currently play for ?'
              placeholder='Enter your current team (if any)'
              value={value}
              maxLength={51}
              onChangeText={onChange}
              isValid={errors.currrentTeam ? false : true}
              errorMessage={
                errors.currrentTeam ? errors.currrentTeam.message : ''
              }
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='coachName'
          control={control}
          rules={{
            maxLength: {
              value: 50,
              message: 'Coach name cannot exceed 50 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              label='Who is your coach ?'
              placeholder='Enter your coach name (if any)'
              value={value}
              maxLength={51}
              onChangeText={onChange}
              isValid={errors.coachName ? false : true}
              errorMessage={errors.coachName ? errors.coachName.message : ''}
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Controller
          name='availableForSponsorship'
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onChange(!value)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                // backgroundColor: 'red',
              }}>
              <Text style={[fontBold(14, textColor), {flex: 1}]}>
                Would you like to be visible to sponsors?
              </Text>
              <Switch
                trackColor={{
                  true: appColors.warmRed,
                }}
                value={value}
              />
            </TouchableOpacity>
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
  formData: RegisterPlayerFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterPlayerFormData>>;
  setRegistrationStep: React.Dispatch<React.SetStateAction<number>>;
  onSubmitForm: (data: RegisterPlayerFormData) => void;
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
      fbLink: '', // number
      xLink: '', // number
      instaLink: '',
    },
  });

  const onSubmit = async (data: SocialMediaLinksFormData) => {
    try {
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
              onChangeText={onChange}
              maxLength={101}
              autoCapitalize='none'
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
              value={value}
              onChangeText={onChange}
              maxLength={101}
              autoCapitalize='none'
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
              maxLength={101}
              autoCapitalize='none'
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
  formData: RegisterPlayerFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterPlayerFormData>>;
  setRegistrationStep: React.Dispatch<React.SetStateAction<number>>;
};

type SportsExperienceFormData = {
  primarySport: DropDownItemType | null;
  playingLevel: DropDownItemType | null;
  secondarySports: number[];
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
      playingLevel: null, // number
      secondarySports: [],
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
        playingLevel: data.playingLevel?.value as number,
        secondarySports: data.secondarySports,
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
        <Controller
          name='playingLevel'
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Kindly select playing level',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomDropDown
              label='Your playing level in primary sport ?'
              customLabelStyles={{
                marginTop: 4,
              }}
              buttonTitle='Select Play Level'
              sheetTitle='Select 1 Primary Sport '
              data={convertObjectIntoDropDownItemsArrayFormat(playerLevels)}
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
              isValid={errors.playingLevel ? false : true}
              errorMessage={
                errors.playingLevel ? errors.playingLevel.message : ''
              }
            />
          )}
        />
      </View>

      <View style={{marginBottom: 26}}>
        <Text style={[fontBold(14, textColor), {marginBottom: 18}]}>
          Any secondary sports you play or Interested In ?
        </Text>
        <Controller
          name='secondarySports'
          control={control}
          rules={{
            required: {
              value: true,
              message:
                'Kindly select atleast one secondary sport you are interested in',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <MultiItemSelector
              data={{...sports}}
              selectedItems={value || []}
              onItemSelected={sports => {
                onChange(sports);
              }}
              isValid={errors.secondarySports ? false : true}
              errorMessage={
                errors.secondarySports ? errors.secondarySports.message : ''
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
                playingLevel: data.playingLevel,
                secondarySports: data.secondarySports,
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

export default PlayerRegistrationDetails;

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
