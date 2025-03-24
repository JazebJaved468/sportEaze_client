import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import PageContainer from '../../../components/PageContainer';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {CloudinaryUploadPresets} from '../../../constants/cloudinary';
import {POST_MEDIA_LIMIT} from '../../../constants/media';
import {
  useUploadImageMutation,
  useUploadVideoMutation,
} from '../../../store/postFeed/postFeed.service';
import {SelectedImage, SelectedVideo} from '../../../types/postFeed/postFeed';
import {openImageOrVideoPicker} from '../../../utils/helpers/mediaPicker';
import {Button, CheckCircleIcon, Text, View} from 'native-base';
import {
  ArrowDownIcon,
  CircularCheckIcon,
  CircularCrossIcon,
  CircularInfoIcon,
  CrossIcon,
  GalleryIcon,
  SparkleStarsIcon,
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
import {fontBold, fontLight, fontRegular} from '../../../styles/fonts';
import {appColors} from '../../../constants/colors';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {Controller, useForm} from 'react-hook-form';
import {
  extractValidJSONFromGeminiResponse,
  geminiModel,
} from '../../../utils/helpers/gemini';
import {Part} from '@google/generative-ai';
import RNFS from 'react-native-fs';
import {getMediaType} from '../../../utils/helpers/media';
import {MediaType, PostVisibility} from '../../../constants/enums';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {MediaPreviewPage} from '../../../components/MediaPreview';
import {CustomDropDown} from '../../../components/CustomDropDown';
import {DropDownItemType} from '../../../components/CustomDropDown/CustomDropDown';
import {PulseEffect} from '../../../components/PulseEffect';

type GeminiAnalysisType = {
  response?: GeminiAnalysisResponse;
  analysisDone: boolean;
  analysisCIP: boolean;
};

type GeminiAnalysisResponse = {
  is_sports_related: boolean;
  reason: string;
  category: string;
};

export const CreatePost = () => {
  const navigation = useAppNavigation();
  const {isLoggedIn, user, userType} = useAppSelector(state => state.auth);

  const [hashTags, setHashTags] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<
    ImageOrVideo[] | null | undefined
  >(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiAnalysisType>({
    response: undefined,
    analysisDone: false,
    analysisCIP: false,
  });

  const postVisibilityOptions: DropDownItemType[] = [
    {id: 1, title: 'Public', value: PostVisibility.PUBLIC},
    {id: 2, title: 'Private', value: PostVisibility.PRIVATE},
  ];
  const [postVisibility, setPostVisibility] = useState<DropDownItemType | null>(
    postVisibilityOptions[0],
  );

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

  const [uploadImagesToCloudinary, {isLoading: imageUploadCIP}] =
    useUploadImageMutation();
  const [uploadVideosToCloudinary, {isLoading: videoUploadCIP}] =
    useUploadVideoMutation();

  const selectMedia = async () => {
    const selectedFiles = await openImageOrVideoPicker();

    if (selectedFiles.length > 0) {
      // Limiting the number of media files to 5
      const maxSelectedMedia = selectedFiles.slice(0, POST_MEDIA_LIMIT);
      setSelectedMedia(maxSelectedMedia);
    }
  };

  const getGeminiResponse = async ({caption = ''}: {caption: string}) => {
    try {
      if (selectedMedia && selectedMedia?.length > 0) {
        setGeminiAnalysis(prev => ({
          ...prev,
          analysisDone: false,
          analysisCIP: true,
        }));
        const prompt = `## Input: - Caption (text): ${caption || 'No caption provided'} - Media (image/video): ${selectedMedia?.length || 0 > 0 ? 'Attached' : 'None'}`;

        // Creating parts array for multiple images/videos
        const mediaToVerify: Part[] = selectedMedia
          ? await Promise.all(
              selectedMedia.map(async media => {
                const base64 = await RNFS.readFile(media.path, 'base64');
                return {
                  inlineData: {
                    mimeType: media.mime,
                    data: base64,
                  },
                };
              }),
            )
          : [];

        const geminiResponse = await geminiModel.generateContent([
          prompt,
          ...mediaToVerify,
        ]);

        if (geminiResponse) {
          const validResponse = extractValidJSONFromGeminiResponse(
            geminiResponse?.response?.candidates?.[0].content.parts[0].text ||
              '{}',
          );

          setGeminiAnalysis(prev => ({
            ...prev,
            response: validResponse,
            analysisDone: true,
            analysisCIP: false,
          }));

          return validResponse;
        }
      }
    } catch (error) {
      console.log('error', error);
      setGeminiAnalysis(prev => ({
        ...prev,
        analysisDone: false,
        analysisCIP: false,
      }));
    }
  };

  const uploadImages = async ({images}: {images: SelectedImage[]}) => {
    // console.log('Uploading Images.....', images.length);
    const base64Images = await Promise.all(
      images.map(async media => {
        const base64Img = await RNFS.readFile(media.path, 'base64');
        return base64Img;
      }),
    );
    const uploadPromises = base64Images.map(img => {
      return uploadImagesToCloudinary({
        imageDataBase64: `data:image/jpg;base64,${img}`,
        uploadPreset: CloudinaryUploadPresets.POST_IMAGES,
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);
    // console.log('- Images Uploaded Successfully');
    // console.log('Uploaded Images: ', JSON.stringify(uploadedImages));
    return uploadedImages;
  };

  const uploadVideos = async ({videos}: {videos: SelectedVideo[]}) => {
    // console.log('Uploading Videos.....', videos.length);
    const uploadPromises = videos.map(video => {
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
    // console.log('- Videos Uploaded Successfully');
    // console.log('Uploaded Videos: ', JSON.stringify(uploadedVideos));
    return uploadedVideos;
  };

  const onSubmit = async (data: {caption: string}) => {
    try {
      const geminiRes: GeminiAnalysisResponse = await getGeminiResponse({
        caption: data.caption,
      });

      if (geminiRes && !geminiRes.is_sports_related) {
        return;
      }

      const images = selectedMedia?.filter(
        media => getMediaType(media.mime) === MediaType.IMAGE,
      );
      const videos = selectedMedia?.filter(
        media => getMediaType(media.mime) === MediaType.VIDEO,
      );
      let imageUploadPromise = null;
      let videoUploadPromise = null;

      if (images && images.length > 0) {
        imageUploadPromise = uploadImages({images: images as SelectedImage[]});
      }
      if (videos && videos.length > 0) {
        videoUploadPromise = uploadVideos({videos: videos as SelectedVideo[]});
      }

      // Wait for both uploads to complete and get their responses
      const [imageUploadResponse, videoUploadResponse] = await Promise.all([
        imageUploadPromise,
        videoUploadPromise,
      ]);

      console.log('Images Uploaded:', imageUploadResponse);
      console.log('Videos Uploaded:', videoUploadResponse);

      cleanData();
    } catch (e) {
      console.log(
        '-------xxxxxx----------Error while Post Submission: CreatePost.tsx',
        e,
      );
    }
  };

  const handlePostVisibilitySelection = (item: DropDownItemType) => {
    setPostVisibility(item);
  };

  const generateHashTags = () => {
    console.log('Dummy : Generating HashTags using AI ....');
    setHashTags(['#Hashtag1', '#Hashtag2', '#Hashtag3', '#Hashtag4']);
  };

  const removeMedia = (selectedMediaPath: string) => {
    setSelectedMedia(prev =>
      prev?.filter((media, i) => media.path !== selectedMediaPath),
    );
  };

  const backgroundColor = usePageBackgroundColor();
  const textColor = useTextColor();
  const inverseTextColor = useInverseTextColor();

  const cleanData = () => {
    // Resetting the form after successful post creation
    reset({
      caption: '',
    });
    setSelectedMedia(null);
    setHashTags([]);
    setGeminiAnalysis({
      response: undefined,
      analysisDone: false,
      analysisCIP: false,
    });
  };

  return (
    <PageContainer>
      <GeneralHeader
        showRightElement
        title='Create New Post'
        showLeftElement={false}
        rightElement={
          <PulseEffect>
            <Button
              onPress={handleSubmit(onSubmit)}
              isLoading={
                imageUploadCIP || videoUploadCIP || geminiAnalysis.analysisCIP
              }
              style={{
                backgroundColor: appColors.warmRed,
                borderRadius: 12,
                width: 72,
                height: 34,
              }}>
              <Text
                style={[
                  fontRegular(14, inverseTextColor),
                  {paddingVertical: 6},
                ]}>
                Publish
              </Text>
            </Button>
          </PulseEffect>
        }
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Caption Box */}
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

            <CustomDropDown
              buttonTitle='Visibility'
              sheetTitle='Select Post Visibility'
              data={postVisibilityOptions}
              selectedItem={postVisibility}
              snapPoints={['25%']}
              onItemSelect={handlePostVisibilitySelection}
              style={{
                buttonWidth: 90,
              }}
            />

            {/* <TouchableOpacity
              style={styles.visibilityDropDown}
              activeOpacity={0.6}>
              <Text style={fontRegular(14, inverseTextColor)}>Post</Text>
              <View style={{marginTop: 3}}>
                <ArrowDownIcon color={inverseTextColor} width={16} height={6} />
              </View>
            </TouchableOpacity> */}
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

        {/* HashTags Section */}
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
                  #SportEaze #Achievement #Sponsored
                </Text>
              </>
            )}
          </View>

          <PulseEffect>
            <Button
              onPress={generateHashTags}
              // isLoading={registerFanCIP || loginUserCIP}
              style={{
                backgroundColor: appColors.warmRed,
                borderRadius: 12,
                width: 110,
                height: 34,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}>
                <View>
                  <SparkleStarsIcon
                    width={24}
                    height={24}
                    color={appColors.white}
                  />
                </View>
                <Text style={[fontRegular(14, appColors.white)]}>Generate</Text>
              </View>
            </Button>
          </PulseEffect>
        </View>

        {/* Select Media Button */}
        <TouchableOpacity onPress={selectMedia} activeOpacity={0.6}>
          <View style={[styles.selectMediaBox]}>
            <View>
              <Text style={[fontRegular(14, textColor)]}>
                {`Select Media  `}
                <Text style={[fontLight(12, textColor)]}>(Upto 5)</Text>
              </Text>
            </View>
            <GalleryIcon width={28} height={28} color={textColor} />
          </View>
        </TouchableOpacity>

        {/* Media Previews  */}
        <View>
          <FlatList
            contentContainerStyle={{
              flexDirection: 'row',
              gap: 14,
              marginTop: 20,
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={selectedMedia}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  navigation.navigate(MediaPreviewPage, {
                    mediaPath: item.path,
                    mediaType: getMediaType(item.mime),
                    onRemove: () => {
                      removeMedia(item.path);
                    },
                  });
                }}>
                <View>
                  <Image
                    source={{uri: item.path}}
                    style={{
                      width: 150,
                      height: 180,
                      borderRadius: 24,
                    }}
                  />

                  <View style={styles.removeMedia}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      hitSlop={30}
                      onPress={() => {
                        removeMedia(item.path);
                      }}>
                      <CrossIcon width={8} height={8} color={appColors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* AI Analysis */}
        {geminiAnalysis.analysisCIP ? (
          <View
            style={[
              styles.analysisBox,
              {
                borderWidth: 0.5,
                borderColor: appColors.success,
                backgroundColor: `${appColors.success}30`,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 10,
              },
            ]}>
            <ActivityIndicator color={appColors.black} />
            <Text style={fontRegular(14, appColors.black)}>
              AI Analysis in progress
            </Text>
          </View>
        ) : null}

        {geminiAnalysis.analysisDone &&
        geminiAnalysis.response?.is_sports_related ? (
          <View
            style={[
              styles.analysisBox,
              {
                borderWidth: 0.5,
                borderColor: appColors.success,
                backgroundColor: `${appColors.success}30`,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 10,
              },
            ]}>
            <CircularCheckIcon width={16} height={16} color={appColors.black} />

            <Text style={fontRegular(14, appColors.black)}>
              Sports Related Content
            </Text>
          </View>
        ) : null}
        {geminiAnalysis.analysisDone &&
        !geminiAnalysis.response?.is_sports_related ? (
          <View
            style={[
              styles.analysisBox,
              {
                borderWidth: 0.5,
                borderColor: appColors.error,
                backgroundColor: `${appColors.error}30`,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 12,
              }}>
              <CircularCrossIcon
                width={16}
                height={16}
                color={appColors.black}
              />

              <Text style={fontBold(14, appColors.black)}>
                Not Sports Related Content
              </Text>
            </View>
            <Text
              style={[fontRegular(12, appColors.black), {marginBottom: 10}]}>
              Reason :{geminiAnalysis.response?.reason}
            </Text>
            <Text style={fontBold(14, appColors.black)}>
              Kindly review your content and try again
            </Text>
          </View>
        ) : null}

        {/* Terms And Policies */}

        <View style={{marginTop: 'auto', marginBottom: 20}}>
          <TouchableOpacity
            style={{
              marginTop: 20,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            }}
            hitSlop={20}
            activeOpacity={0.6}
            onPress={() => {}}>
            <CircularInfoIcon
              width={16}
              height={16}
              color={appColors.warmRed}
            />
            <Text
              style={[
                fontRegular(14, appColors.warmRed),
                {textDecorationLine: 'underline'},
              ]}>
              Terms and Policies
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginTop: 20,
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
    gap: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  removeMedia: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: appColors.warmRed,

    padding: 6,
    borderRadius: 6,
    // borderTopRightRadius: 24,
    // borderBottomLeftRadius: 20,
    // borderTopLeftRadius: 20,
  },

  analysisBox: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 30,
  },
});

// const [selectedImages, setSelectedImages] = useState<ImageOrVideo[] | null>(
//   null,
// );
// const [selectedVideos, setSelectedVideos] = useState<ImageOrVideo[] | null>(
//   null,
// );

// const selectImages = async ({
//   useCamera = false, // By Default Gallery will open
// }: {
//   useCamera?: boolean;
// }) => {
//   const selectedImages = useCamera
//     ? await openImageCamera()
//     : await openImagePicker();

//   if (selectedImages.length > 0) {
//     // Limiting the number of images to 5
//     const maxSelectedImages = selectedImages.slice(0, POST_IMAGES_LIMIT);
//     setSelectedImages(maxSelectedImages);
//   }
// };

// const selectVideos = async ({
//   useCamera = false, // By Default Gallery will open
// }: {
//   useCamera?: boolean;
// }) => {
//   const selectedVideos = useCamera
//     ? await openVideoCamera()
//     : await openVideoPicker();

//   if (selectedVideos.length > 0) {
//     // Limiting the number of videos to 5
//     const maxSelectedVideos = selectedVideos.slice(0, POST_VIDEOS_LIMIT);
//     setSelectedVideos(maxSelectedVideos);
//   }
// };
