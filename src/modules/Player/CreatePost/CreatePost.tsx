import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
} from '../../../utils/customHooks/helpers/mediaPicker';
import {Button} from 'native-base';
import {ImagePlaceholderIcon} from '../../../assets/icons';

export const CreatePost = () => {
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[] | null>(
    null,
  );
  const [selectedVideos, setSelectedVideos] = useState<ImageOrVideo[] | null>(
    null,
  );

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

  return (
    <PageContainer>
      <ScrollView>
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
    </PageContainer>
  );
};

const styles = StyleSheet.create({});
