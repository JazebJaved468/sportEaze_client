import {useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';

export const useTextColor = () => {
  return useColorModeValue(appColors.black, appColors.white);
};

export const usePageBackgroundColor = () => {
  return useColorModeValue(appColors.white, appColors.charcoalBlue);
};
