import {PermissionsAndroid} from 'react-native';

export enum PERMISSION_RESULT {
  GRANTED = 'granted',
  DENIED = 'denied',
  NEVER_ASK_AGAIN = 'never_ask_again',
}

export const askReadExternalStoragePermission = async () => {
  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  return status;
};
