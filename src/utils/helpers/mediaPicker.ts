import {
  askReadExternalStoragePermission,
  PERMISSION_RESULT,
} from './permissions';

import ImagePicker from 'react-native-image-crop-picker';

import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {Alert} from 'react-native';

const pickDocument = async () => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.video],
    });

    console.log('Video: ', res);
    return res;
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      Alert.alert('Cancelled', 'Video selection cancelled.');
    } else {
      Alert.alert(`Error --- ${JSON.stringify(err)}`);
    }
  }
};

export const openVideoPicker = async () => {
  try {
    const status = await askReadExternalStoragePermission();

    if (status === PERMISSION_RESULT.GRANTED) {
      const selectedMedia = await ImagePicker.openPicker({
        // width: 1000,
        // height: 1000,
        mediaType: 'video',
        multiple: true,
      });
      if (selectedMedia) {
        return selectedMedia;
      } else {
        return [];
      }
    } else {
      console.log('External Storage Permission Denied');
      return [];
    }
  } catch (error) {
    console.log('xxxxx--- Error: Open Image Picker --- ', error);
    return [];
  }
};

export const openImagePicker = async (selectMultiple: boolean = true) => {
  try {
    const status = await askReadExternalStoragePermission();

    if (status === PERMISSION_RESULT.GRANTED) {
      const selectedMedia = await ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        includeBase64: true,
        mediaType: 'photo',
        multiple: selectMultiple,
        maxFiles: 5,
      });
      if (selectedMedia) {
        if (Array.isArray(selectedMedia)) {
          return selectedMedia;
        }
        return [selectedMedia];
      } else {
        return [];
      }
    } else {
      console.log('External Storage Permission Denied');
      return [];
    }
  } catch (error) {
    console.log('xxxxx--- Error: Open Image Picker --- ', error);
    return [];
  }
};

export const openVideoCamera = async () => {
  try {
    const selectedMedia = await ImagePicker.openCamera({
      mediaType: 'video',
    });
    if (selectedMedia) {
      return [selectedMedia];
    } else {
      return [];
    }
  } catch (error) {
    console.log('xxxxx--- Error: Open Camera ---', error);
    return [];
  }
};

export const openImageCamera = async () => {
  try {
    const selectedMedia = await ImagePicker.openCamera({
      width: 1000,
      height: 1000,
      cropping: true,
      includeBase64: true,
      mediaType: 'photo',
    });
    if (selectedMedia) {
      return [selectedMedia];
    } else {
      return [];
    }
  } catch (error) {
    console.log('xxxxx--- Error: Open Camera ---', error);
    return [];
  }
};
