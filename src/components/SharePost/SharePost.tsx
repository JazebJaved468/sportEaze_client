import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ShareIcon, UserPlaceholderIcon} from '../../assets/icons';
import {CustomTextInputField} from '../CustomInputField';
import {fontRegular} from '../../styles/fonts';
import {
  usePageBackgroundColor,
  useTextColor,
  useInverseTextColor,
  useLightTextColor,
} from '../../utils/customHooks/colorHooks';
import {appColors} from '../../constants/colors';
import {PulseEffect} from '../PulseEffect';
import {Button} from 'native-base';
import {useAppNavigation} from '../../utils/customHooks/navigator';
import {AcceptedConnectionsPage} from '../../modules/Core/Networking';
import {
  useAppDispatch,
  useAppSelector,
} from '../../utils/customHooks/storeHooks';
import {useContainerShadow} from '../../utils/customHooks/customHooks';
import {useSharePostMutation} from '../../store/player/player.service';
import {updateToast} from '../../store/core/core.slice';

type SharePostProps = {
  postId: string;
  closeBottomSheet: () => void;
};

const SharePost: React.FC<SharePostProps> = ({postId, closeBottomSheet}) => {
  const navigation = useAppNavigation();

  const {user} = useAppSelector(state => state.auth);

  const backgroundColor = usePageBackgroundColor();
  const textColor = useTextColor();
  const inverseTextColor = useInverseTextColor();
  const lightTextColor = useLightTextColor();
  const containerShadow = useContainerShadow(3, `${appColors.black}90`);

  const dispatch = useAppDispatch();

  const [sharePost, {isLoading: sharePostCIP}] = useSharePostMutation();
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      caption: '',
    },
  });

  const onSubmit = async (data: {caption: string}) => {
    try {
      await sharePost({
        originalPostId: postId,
        shareMessage: data.caption,
      }).unwrap();

      closeBottomSheet();

      dispatch(
        updateToast({
          isVisible: true,
          message: 'Post shared successfully to your network',
        }),
      );

      Keyboard.dismiss();
    } catch (error) {
      console.log('Error while sharing post:', error);
    }
  };

  return (
    <View style={[containerShadow, styles.container, {backgroundColor}]}>
      <View style={styles.metaData}>
        <View style={styles.picAndName}>
          <View style={styles.profilePicContainer}>
            {user?.profilePicUrl ? (
              <Image
                source={{uri: user.profilePicUrl}}
                style={{
                  width: 46,
                  height: 46,
                  objectFit: 'contain',
                  borderRadius: 9,
                }}
              />
            ) : (
              <UserPlaceholderIcon width={28} height={28} color={textColor} />
            )}
          </View>
          <View style={{gap: 4}}>
            <Text style={fontRegular(14, textColor)}>{user?.fullName}</Text>
            <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
              <Text style={fontRegular(12, lightTextColor)}>
                Sharing Post to your
              </Text>
              <TouchableOpacity
                hitSlop={40}
                activeOpacity={0.5}
                onPress={() => {
                  navigation.navigate(AcceptedConnectionsPage);
                  closeBottomSheet();
                }}>
                <Text style={fontRegular(12, appColors.warmRed)}>Network</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Caption Wrapper */}
      <View style={{marginBottom: 10}}>
        <Controller
          name='caption'
          control={control}
          rules={{
            maxLength: {
              value: 1000,
              message: 'Caption cannot exceed 1000 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              borderWidth={0}
              placeholder='Write your thoughts...'
              value={value}
              maxLength={1001}
              numberOfLines={5}
              onChangeText={onChange}
              isValid={errors.caption ? false : true}
              errorMessage={errors.caption ? errors.caption.message : ''}
              autoCapitalize='sentences'
              height={'auto'}
              textAlignVertical='top'
            />
          )}
        />
      </View>
      <PulseEffect>
        <Button
          onPress={handleSubmit(onSubmit)}
          isLoading={sharePostCIP}
          isDisabled={sharePostCIP}
          style={{
            backgroundColor: appColors.warmRed,
            borderRadius: 12,
            width: 116,
            height: 40,
            alignSelf: 'flex-end',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <ShareIcon color={appColors.white} width={22} height={22} />
            <Text
              style={[fontRegular(13, inverseTextColor), {paddingVertical: 6}]}>
              Share Now
            </Text>
          </View>
        </Button>
      </PulseEffect>
    </View>
  );
};

export default SharePost;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 6,
    marginBottom: 20,
  },
  shadowBox: {
    shadowColor: '#00000090',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },

  metaData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  picAndName: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  profilePicContainer: {
    width: 46,
    height: 46,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
});
