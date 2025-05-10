import {Image, Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {
  useGetPatronRequestsQuery,
  useVerifyPatronMutation,
} from '../../../store/superAdmin/superAdmin.service';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {Button, DeleteIcon} from 'native-base';
import {appColors} from '../../../constants/colors';
import {
  TickIcon,
  UserApprovedIcon,
  UserPendingIcon,
  UserPlaceholderIcon,
  UserRejectedIcon,
} from '../../../assets/icons';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {Controller, useForm} from 'react-hook-form';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {PulseEffect} from '../../../components/PulseEffect';
import {PatronAccountStatus} from '../../../constants/enums';
import {Loader} from '../../../components/Loader';
import {User} from '../../../types/auth/auth.type';
import {Divider} from '../../../components/Divider';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {PatronAccountStatusBadge} from '../PatronRequests/PatronRequests';
import {TouchableOpacity} from 'react-native-gesture-handler';

type PatronDetailsVerificationPageRouteProp = RouteProp<
  RootStackParamList,
  'PatronDetailsVerificationPage'
>;
const PatronDetailsVerification = () => {
  const {params} = useRoute<PatronDetailsVerificationPageRouteProp>();
  const navigation = useAppNavigation();

  const [verifyPatron, {isLoading: patronVerificationCIP}] =
    useVerifyPatronMutation();
  const {data} = useGetPatronRequestsQuery(undefined, {
    selectFromResult(state) {
      const filteredData = state.data?.filter(
        item => item.id === params.patronId,
      );
      console.log('filteredData', filteredData);

      return {
        data: filteredData,
      };
    },
  });

  const patronData = data?.[0];

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      adminComment: patronData?.patron?.adminReviewComment || '',
    },
  });

  const textColor = useTextColor();

  const handleReject = async (comment: string) => {
    try {
      if (patronData)
        await verifyPatron({
          patronId: patronData?.id,
          status: PatronAccountStatus.REJECTED,
          adminReviewComment: comment,
        }).unwrap();
    } catch (e) {
      console.log('Error while rejecting the patron', e);
    }
  };

  const handleRequestModification = async (comment: string) => {
    try {
      if (patronData)
        await verifyPatron({
          patronId: patronData?.id,
          status: PatronAccountStatus.MODIFICATION_REQUIRED,
          adminReviewComment: comment,
        }).unwrap();
    } catch (e) {
      console.log('Error while requesting for modification the patron', e);
    }
  };

  const handleApprove = async () => {
    try {
      if (patronData)
        await verifyPatron({
          patronId: patronData?.id,
          status: PatronAccountStatus.APPROVED,
          adminReviewComment: '',
        }).unwrap();
    } catch (e) {
      console.log('Error while approving the patron', e);
    }
  };

  const onSubmit = async (data: {adminComment: string; action: number}) => {
    console.log('data - onsubmit', data);

    if (data.action === PatronAccountStatus.REJECTED) {
      handleReject(data.adminComment);
    } else if (data.action === PatronAccountStatus.MODIFICATION_REQUIRED) {
      handleRequestModification(data.adminComment);
    }
  };
  return (
    <PageContainer>
      <GeneralHeader
        title={`${patronData?.fullName}'s Verification`}
        showRightElement={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.container}>
        <View>
          <Text style={[fontBold(16, textColor)]}>Admin Actions</Text>

          {patronVerificationCIP ? (
            <View style={{marginVertical: customHeight(14)}}>
              <Loader />
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                //   marginHorizontal: 16,
                gap: customWidth(10),
                marginBottom: customHeight(10),
              }}>
              <View style={styles.buttonWrapper}>
                <PulseEffect>
                  <Button
                    isDisabled={patronVerificationCIP}
                    style={[
                      styles.button,
                      {
                        borderWidth: 1,
                        borderColor: appColors.warmRed,
                        backgroundColor: appColors.transparent,
                      },
                    ]}
                    onPress={() => {
                      handleSubmit(data => {
                        onSubmit({
                          action: PatronAccountStatus.REJECTED,
                          adminComment: data.adminComment,
                        });
                      })();
                    }}>
                    <View style={styles.buttonInnerWrapper}>
                      <DeleteIcon color={appColors.warmRed} />
                      <Text style={fontRegular(13, appColors.warmRed)}>
                        Reject
                      </Text>
                    </View>
                  </Button>
                </PulseEffect>
              </View>

              <View style={styles.buttonWrapper}>
                <PulseEffect>
                  <Button
                    isDisabled={patronVerificationCIP}
                    style={styles.button}
                    p={0}
                    py={0}
                    onPress={() => {
                      handleSubmit(data => {
                        onSubmit({
                          action: PatronAccountStatus.MODIFICATION_REQUIRED,
                          adminComment: data.adminComment,
                        });
                      })();
                    }}>
                    <View style={styles.buttonInnerWrapper}>
                      <UserPendingIcon
                        width={14}
                        height={14}
                        strokeWidth={1.6}
                        color={appColors.white}
                      />
                      <Text
                        style={[
                          fontRegular(11, appColors.white),
                          {textAlign: 'center'},
                        ]}>
                        {`Request\nModification`}
                      </Text>
                    </View>
                  </Button>
                </PulseEffect>
              </View>
              <View style={styles.buttonWrapper}>
                <PulseEffect>
                  <Button
                    isDisabled={patronVerificationCIP}
                    style={styles.button}
                    p={0}
                    py={0}
                    onPress={() => {
                      handleApprove();
                    }}>
                    <View style={styles.buttonInnerWrapper}>
                      <TickIcon
                        width={14}
                        height={14}
                        strokeWidth={2}
                        color={appColors.white}
                      />
                      <Text style={fontRegular(13, appColors.white)}>
                        Approve
                      </Text>
                    </View>
                  </Button>
                </PulseEffect>
              </View>
            </View>
          )}

          {/* comment box  */}
          <View style={{marginBottom: 20}}>
            <Controller
              name='adminComment'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Your Comment is required',
                },
                minLength: {
                  value: 3,
                  message: 'Comment must be atleast 3 characters long',
                },
                maxLength: {
                  value: 500,
                  message: 'Comment cannot exceed 500 characters',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInputField
                  label='Admin Comment'
                  placeholder='Add some comment for Patron'
                  maxLength={501}
                  autoCapitalize='words'
                  value={value}
                  onChangeText={onChange}
                  isValid={errors.adminComment ? false : true}
                  errorMessage={
                    errors.adminComment ? errors.adminComment.message : ''
                  }
                />
              )}
            />
          </View>
        </View>

        <PatronDetails data={patronData as User} />
      </ScrollView>
    </PageContainer>
  );
};

const PatronDetails = ({data}: {data: User}) => {
  const textColor = useTextColor();
  const cardColor = useCardColor();

  const containerShadow = useContainerShadow();

  return (
    <View
      style={[
        {
          backgroundColor: cardColor,
          paddingHorizontal: customWidth(16),
          paddingVertical: customHeight(20),
          borderRadius: 14,
          flex: 1,
          marginBottom: customHeight(16),
        },
        containerShadow,
      ]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: customWidth(16),
        }}>
        <View>
          <View
            style={{
              alignItems: 'flex-start',
              gap: customHeight(4),
              marginBottom: customHeight(16),
            }}>
            <Text
              style={[
                fontBold(14, textColor),
                {marginBottom: customHeight(6)},
              ]}>
              Current Status
            </Text>

            {data.patron?.status ? (
              <PatronAccountStatusBadge status={data.patron?.status} />
            ) : null}
          </View>
          <Tile title='Name' value={data.fullName} />
          <Tile title='Username' value={data.username} />
        </View>

        <View
          style={{
            width: 120,
            height: 120,
            backgroundColor: appColors.whisperGray,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            overflow: 'hidden',
            marginBottom: customHeight(14),
          }}>
          {data.profilePicUrl ? (
            <Image
              source={{uri: data.profilePicUrl}}
              style={{
                width: 120,
                height: 120,
                objectFit: 'contain',
                borderRadius: 9,
              }}
            />
          ) : (
            <UserPlaceholderIcon width={34} height={34} color={textColor} />
          )}
        </View>
      </View>

      <View style={{marginBottom: customHeight(20)}}>
        <Divider />
      </View>

      <Tile title='Industry' value={data.patron?.industryType} />
      <Tile title='Sports To Support' value={data.patron?.industryType} />
      <Tile title='Preferred Player Levels' value={data.username} />

      <View style={{marginBottom: customHeight(20)}}>
        <Divider />
      </View>

      <Tile title='Portfolio Website' value={data.patron?.website} isLink />
      <Tile title='Facebook' value={data.patron?.fbLink} isLink />
      <Tile title='Instagram' value={data.patron?.instaLink} isLink />
      <Tile title='Linkedin' value={data.patron?.linkedIn} isLink />
      <Tile title='X (Twitter)' value={data.patron?.xLink} isLink />
    </View>
  );
};

const Tile = ({
  title,
  value = '',
  isLink = false,
}: {
  title: string;
  value?: string | null;
  isLink?: boolean;
}) => {
  const textColor = useTextColor();
  const cardColor = useCardColor();

  return (
    <View style={{marginBottom: customHeight(20)}}>
      <Text style={[fontBold(14, textColor), {marginBottom: customHeight(6)}]}>
        {title}
      </Text>
      {isLink && value ? (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(value);
          }}
          activeOpacity={0.5}>
          <Text style={[fontRegular(14, '#0A84FF')]}>{value ?? ''}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={[fontRegular(14, textColor)]}> {value ?? ''}</Text>
      )}
    </View>
  );
};

export default PatronDetailsVerification;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: customHeight(10),
  },
  button: {
    height: 36,
    padding: 0,
    // marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 14,
    // flex: 1,
  },
  buttonInnerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonWrapper: {
    flex: 1,
  },
});
