import {StyleSheet, View, Image} from 'react-native';
import React, {useState} from 'react';
import PageContainer from '../../../components/PageContainer';
import {Button, useColorMode} from 'native-base';
import {storeInLocalStorage} from '../../../utils/customHooks/helpers/asyncStorage';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {
  askReadExternalStoragePermission,
  PERMISSION_RESULT,
} from '../../../utils/customHooks/helpers/permissions';
import {ImagePlaceholderIcon} from '../../../assets/icons';
import {useUploadImageMutation} from '../../../store/postFeed/postFeed.service';

export const FanMenu = () => {
  const {colorMode, setColorMode, toggleColorMode} = useColorMode();

  const [selectedImage, setSelectedImage] = useState<ImageOrVideo | null>(null);

  const [uploadImageToCloudinary] = useUploadImageMutation();

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 1000,
        height: 1000,
        cropping: true,
        includeBase64: true,
      });
      if (image) {
        setSelectedImage(image);
      }

      const res = await uploadImageToCloudinary({
        imageDataBase64: `data:image/jpg;base64,${selectedImage?.data}`,
        uploadPreset: 'post_images',
      }).unwrap();

      // console.log('cloudinary response --->', res);
    } catch (error) {
      console.log('xxxxx--- Error: Open Camera ---', error);
    }
  };

  const openImagePicker = async () => {
    try {
      const status = await askReadExternalStoragePermission();

      if (status === PERMISSION_RESULT.GRANTED) {
        const image = await ImagePicker.openPicker({
          width: 1000,
          height: 1000,
          cropping: true,
          includeBase64: true,
        });
        if (image) {
          setSelectedImage(image);
        }

        const res = await uploadImageToCloudinary({
          imageDataBase64: `data:image/jpg;base64,${selectedImage?.data}`,
          uploadPreset: 'post_images',
        }).unwrap();

        // console.log('cloudinary response --->', res);
      } else {
        console.log('External Storage Permission Denied');
      }
    } catch (error) {
      console.log('xxxxx--- Error: Open Image Picker --- ', error);
    }
  };

  return (
    <PageContainer>
      <View
        style={{
          width: 200,
          height: 200,
          overflow: 'hidden',
        }}>
        {selectedImage === null ? (
          <ImagePlaceholderIcon width={200} height={200} strokeWidth={0.5} />
        ) : (
          <Image
            style={{
              width: 200,
              height: 200,
            }}
            source={{uri: selectedImage.path}}
          />
        )}
      </View>

      <View style={{justifyContent: 'center', flex: 1}}>
        <Button
          m={10}
          py={3}
          onPress={() => {
            toggleColorMode();
            storeInLocalStorage({
              key: 'colorMode',
              value: colorMode === 'light' ? 'dark' : 'light',
            });
          }}>
          Switch Color Mode
        </Button>

        <Button
          m={10}
          py={3}
          onPress={async () => {
            await openImagePicker();
          }}>
          Upload Image
        </Button>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({});
