import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';
import {PlayerProfilePageRouteProp} from '../../Player/PlayerProfile/PlayerProfile';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {appColors} from '../../../constants/colors';
import {EndorsementIcon, UserPlaceholderIcon} from '../../../assets/icons';
import {
  useTextColor,
  useLightTextColor,
  useCardColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {Button} from 'native-base';
import {PulseEffect} from '../../../components/PulseEffect';
import {Controller, useForm} from 'react-hook-form';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {useGiveEndorsementMutation} from '../../../store/patron/patron.service';
import {useAppDispatch} from '../../../utils/customHooks/storeHooks';
import {updateToast} from '../../../store/core/core.slice';
import {useAppNavigation} from '../../../utils/customHooks/navigator';

export type GiveEndorsementPageRouteProp = RouteProp<
  RootStackParamList,
  'GiveEndorsementPage'
>;

const GiveEndorsement = () => {
  const {params} = useRoute<GiveEndorsementPageRouteProp>();
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();

  const [endorsePlayer, {isLoading}] = useGiveEndorsementMutation();

  const containerShadow = useContainerShadow(4);
  const textColor = useTextColor();
  const lightTextColor = useLightTextColor();
  const cardColor = useCardColor();

  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      endorsement: '',
    },
  });

  const onSubmit = async (data: {endorsement: string}) => {
    try {
      endorsePlayer({
        playerId: params.playerId,
        review: data.endorsement,
        rating: 5,
      })
        .unwrap()
        .then(res => {
          reset();

          dispatch(
            updateToast({
              message:
                'Your endorsement has been sent! It will now appear on the player’s profile.',
              isVisible: true,
            }),
          );

          navigation.goBack();
        });
    } catch (error) {
      console.log('Error submitting endorsement:', error);
    }
  };
  return (
    <PageContainer>
      <GeneralHeader title='Give Endorsement' showRightElement />
      <ScrollView
        showsVerticalScrollIndicator={false}
        // contentInsetAdjustmentBehavior='automatic'
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          flexGrow: 1,
          //   marginTop: '30%',
          //   justifyContent: 'center',
          //   alignItems: 'center',
          marginHorizontal: customWidth(16),
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 'auto',
          }}>
          <EndorsementIcon width={75} height={75} strokeWidth={1.1} />
          <Text
            style={[
              fontBold(14, textColor),
              {
                marginVertical: customHeight(26),
                marginHorizontal: customWidth(50),
                textAlign: 'center',
                lineHeight: 18,
              },
            ]}>
            Your endorsement helps players gain trust, visibility, and real
            opportunities.
          </Text>

          <View
            style={[
              styles.profilePicContainer,
              {
                marginBottom: customHeight(20),
              },
            ]}>
            {params.playerImage ? (
              <Image
                source={{uri: params.playerImage}}
                style={{
                  width: 140,
                  height: 140,
                  objectFit: 'contain',
                  borderRadius: 200,
                }}
              />
            ) : (
              <UserPlaceholderIcon width={70} height={70} color={textColor} />
            )}
          </View>
          <Text
            style={[fontBold(20, textColor), {marginBottom: customHeight(6)}]}>
            {params.playerName}
          </Text>
          <Text
            style={[
              fontRegular(16, lightTextColor),
              {marginBottom: customHeight(20)},
            ]}>
            {params.playerUsername}
          </Text>
        </View>

        <View
          style={[
            containerShadow,
            styles.textBox,
            {backgroundColor: cardColor},
          ]}>
          {/* Caption Wrapper */}
          <View style={{marginBottom: 10}}>
            <Controller
              name='endorsement'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Endorsement is required',
                },
                maxLength: {
                  value: 500,
                  message: 'Endorsement cannot exceed 500 characters',
                },
                minLength: {
                  value: 5,
                  message: 'Endorsement must be at least 10 characters long',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInputField
                  borderWidth={0}
                  placeholder='Share why this athlete stands out…'
                  value={value}
                  maxLength={501}
                  numberOfLines={5}
                  onChangeText={onChange}
                  isValid={errors.endorsement ? false : true}
                  errorMessage={
                    errors.endorsement ? errors.endorsement.message : ''
                  }
                  autoCapitalize='sentences'
                  height={'auto'}
                  textAlignVertical='top'
                />
              )}
            />
          </View>
        </View>

        {/* <Text>{JSON.stringify(params)}</Text> */}
        <View style={{marginTop: 'auto'}}>
          <PulseEffect>
            <Button
              onPress={handleSubmit(onSubmit)}
              isDisabled={isLoading}
              isLoading={isLoading}
              style={styles.submitButton}
              // onPress={handleSubmit(data => {
              //   onSubmit({
              //     fullName: data.fullName,
              //     username: data.username,
              //     dob: data.dob as string,
              //     gender: data.gender as number,
              //   });
              // })}
            >
              Submit
            </Button>
          </PulseEffect>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

export default GiveEndorsement;

const styles = StyleSheet.create({
  profilePicContainer: {
    width: 140,
    height: 140,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
  submitButton: {
    height: 48,
    borderRadius: BUTTON_BORDER_RADIUS,
    marginBottom: 20,
  },
  textBox: {
    paddingHorizontal: 20,
    paddingTop: customHeight(16),
    borderRadius: 20,

    // marginVertical: customHeight(20),
    marginBottom: customHeight(20),
  },
});
