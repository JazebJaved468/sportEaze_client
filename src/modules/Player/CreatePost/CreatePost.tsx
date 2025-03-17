import {FlatList, Image, ScrollView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import PageContainer from '../../../components/PageContainer';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {CloudinaryUploadPresets} from '../../../constants/cloudinary';
import {POST_IMAGES_LIMIT, POST_VIDEOS_LIMIT} from '../../../constants/media';
import {
  useUploadImageMutation,
  useUploadVideoMutation,
} from '../../../store/postFeed/postFeed.service';
import {SelectedImage, SelectedVideo} from '../../../types/postFeed/postFeed';
import {
  openImageCamera,
  openImagePicker,
  openVideoCamera,
  openVideoPicker,
} from '../../../utils/helpers/mediaPicker';
import {Button, Text, View} from 'native-base';
import {
  ArrowDownIcon,
  CrossIcon,
  GalleryIcon,
  ImagePlaceholderIcon,
  UserPlaceholderIcon,
} from '../../../assets/icons';
import GeneralHeader from '../../../components/GeneralHeader';
import {
  useInverseTextColor,
  usePageBackgroundColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';
import {fontRegular, fontThin} from '../../../styles/fonts';
import {appColors} from '../../../constants/colors';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {Controller, useForm} from 'react-hook-form';

export const CreatePost = () => {
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[] | null>(
    null,
  );
  const [selectedVideos, setSelectedVideos] = useState<ImageOrVideo[] | null>(
    null,
  );
  const [hashTags, setHashTags] = useState<string[]>([]);

  const {isLoggedIn, user, userType} = useAppSelector(state => state.auth);

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

  const [uploadImagesToCloudinary, {isLoading: isLoadingImages}] =
    useUploadImageMutation();
  const [uploadVideosToCloudinary, {isLoading}] = useUploadVideoMutation();
  const selectImages = async ({
    useCamera = false, // By Default Gallery will open
  }: {
    useCamera?: boolean;
  }) => {
    const selectedImages = useCamera
      ? await openImageCamera()
      : await openImagePicker();

    if (selectedImages.length > 0) {
      // Limiting the number of images to 5
      const maxSelectedImages = selectedImages.slice(0, POST_IMAGES_LIMIT);
      setSelectedImages(maxSelectedImages);
    }
  };

  const selectVideos = async ({
    useCamera = false, // By Default Gallery will open
  }: {
    useCamera?: boolean;
  }) => {
    const selectedVideos = useCamera
      ? await openVideoCamera()
      : await openVideoPicker();

    if (selectedVideos.length > 0) {
      // Limiting the number of videos to 5
      const maxSelectedVideos = selectedVideos.slice(0, POST_VIDEOS_LIMIT);
      setSelectedVideos(maxSelectedVideos);
    }
  };

  const uploadImages = async () => {
    if (selectedImages) {
      console.log('Uploading Images.....', selectedImages.length);
      const uploadPromises = (selectedImages as SelectedImage[]).map(img => {
        return uploadImagesToCloudinary({
          imageDataBase64: `data:image/jpg;base64,${img.data}`,
          uploadPreset: CloudinaryUploadPresets.POST_IMAGES,
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);
      console.log('- Images Uploaded Successfully');
      //   console.log('Uploaded Images: ', JSON.stringify(uploadedImages));
    }
  };

  const uploadVideos = async () => {
    if (selectedVideos) {
      console.log('Uploading Videos.....', selectedVideos.length);
      const uploadPromises = (selectedVideos as SelectedVideo[]).map(video => {
        const formData = new FormData();
        formData.append('file', {
          uri: `${video.path}`,
          type: video.mime,
          name: `${video.size}`,
        });
        formData.append('upload_preset', CloudinaryUploadPresets.POST_VIDEOS);

        return uploadVideosToCloudinary({
          formData: formData,
        });
      });

      const uploadedVideos = await Promise.all(uploadPromises);
      console.log('- Videos Uploaded Successfully');
      //   console.log('Uploaded Videos: ', JSON.stringify(uploadedVideos));
    }
  };

  const onSubmit = async (data: {caption: string}) => {
    try {
      // await login({
      //   email: data.email,
      //   password: data.password,
      // }).unwrap();
    } catch (e) {
      console.log(
        '-------xxxxxx----------Error while Post Submission: CreatePost.tsx',
        e,
      );
    }
  };

  const generateHashTags = () => {
    console.log('Dummy : Generating HashTags using AI ....');
    setHashTags(['#Hashtag1', '#Hashtag2', '#Hashtag3', '#Hashtag4']);
  };

  const backgroundColor = usePageBackgroundColor();
  const textColor = useTextColor();
  const inverseTextColor = useInverseTextColor();

  return (
    <PageContainer>
      <GeneralHeader
        showRightElement
        title='Create New Post'
        showLeftElement={false}
        rightElement={
          <Button
            onPress={handleSubmit(onSubmit)}
            // isLoading={registerFanCIP || loginUserCIP}
            style={{
              backgroundColor: appColors.warmRed,
              borderRadius: 12,
            }}>
            <Text
              style={[
                fontRegular(14, inverseTextColor),
                {paddingHorizontal: 14, paddingVertical: 6},
              ]}>
              Post
            </Text>
          </Button>
        }
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.shadowBox, styles.textBox, {backgroundColor}]}>
          <View style={styles.metaData}>
            <View style={styles.picAndName}>
              <View style={styles.profilePicContainer}>
                {user?.profilePicUrl ? (
                  <Image
                    source={{uri: user?.profilePicUrl}}
                    style={{
                      width: 54,
                      height: 54,
                      objectFit: 'contain',
                      borderRadius: 9,
                    }}
                  />
                ) : (
                  <UserPlaceholderIcon
                    width={28}
                    height={28}
                    color={textColor}
                  />
                )}
              </View>

              <Text style={fontRegular(16)}>{user?.username}</Text>
            </View>

            <TouchableOpacity
              style={styles.visibilityDropDown}
              activeOpacity={0.6}>
              <Text style={fontRegular(14, inverseTextColor)}>Post</Text>
              <View style={{marginTop: 3}}>
                <ArrowDownIcon color={inverseTextColor} width={16} height={6} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Caption Wrapper */}
          <View style={{marginBottom: 10}}>
            <Controller
              name='caption'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Caption is required',
                },
                maxLength: {
                  value: 1000,
                  message: 'Caption cannot exceed 1000 characters',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInputField
                  borderWidth={0}
                  placeholder="What's on your mind?"
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
        </View>

        <View style={[styles.shadowBox, styles.hashTagsBox, {backgroundColor}]}>
          <View
            style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap', gap: 8}}>
            {hashTags.length > 0 ? (
              hashTags.map((hashtag, index) => (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setHashTags(prev => prev.filter(tag => tag !== hashtag));
                  }}>
                  <View style={styles.hashTag}>
                    <Text key={index} style={fontRegular(12, textColor)}>
                      {hashtag}
                    </Text>

                    <CrossIcon width={8} height={8} color={textColor} />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <>
                <Text style={fontRegular(14, textColor)}>
                  Generate AI Powered HashTags Based On Your Caption
                </Text>
                <Text style={fontRegular(12, textColor)}>
                  e.g, #SportEaze #Achievemnt #Sponsored
                </Text>
              </>
            )}
          </View>
          <Button
            onPress={generateHashTags}
            // isLoading={registerFanCIP || loginUserCIP}
            style={{
              backgroundColor: appColors.warmRed,
              borderRadius: 12,
              width: 86,
            }}>
            <Text
              style={[fontRegular(14, inverseTextColor), {paddingVertical: 6}]}>
              Generate
            </Text>
          </Button>
        </View>

        <TouchableOpacity onPress={() => {}} activeOpacity={0.6}>
          <View style={[styles.selectMediaBox]}>
            <Text style={[fontRegular(14, textColor)]}>Select Media</Text>
            <GalleryIcon width={28} height={28} color={textColor} />
          </View>
        </TouchableOpacity>

        <View
          style={{
            // width: 200,
            // height: 200,
            // overflow: 'hidden',
            flexDirection: 'row',
            gap: 10,
          }}>
          {selectedImages === null || selectImages.length === 0 ? (
            <ImagePlaceholderIcon width={200} height={200} strokeWidth={0.5} />
          ) : (
            <View style={{height: 300, backgroundColor: 'pink'}}>
              <FlatList
                contentContainerStyle={{flexDirection: 'row', gap: 20}}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={selectedImages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <Image
                    source={{uri: item.path}}
                    style={{width: 200, height: 200}}
                  />
                )}
              />
            </View>
          )}
        </View>

        <View style={{justifyContent: 'center', flex: 1}}>
          <Button
            m={10}
            py={3}
            onPress={async () => {
              await uploadImages();
            }}>
            Upload Images
          </Button>

          <Button
            m={10}
            py={3}
            onPress={async () => {
              await selectImages({
                useCamera: false,
              });
            }}>
            select Images
          </Button>

          <Button
            m={10}
            py={3}
            onPress={async () => {
              await selectVideos({
                useCamera: false,
              });

              // await pickVideo();
            }}>
            select Videos
          </Button>
          <Button
            m={10}
            py={3}
            onPress={async () => {
              await uploadVideos();
            }}>
            Upload Videos
          </Button>
        </View>
      </ScrollView>

      <ScrollView></ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  textBox: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderRadius: 20,
    marginTop: 16,
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
    width: 54,
    height: 54,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
  visibilityDropDown: {
    backgroundColor: appColors.warmRed,
    paddingVertical: 8,
    width: 86,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
  },

  hashTagsBox: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  hashTag: {
    // backgroundColor: appColors.warmRed,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: appColors.warmRed,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  selectMediaBox: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});
