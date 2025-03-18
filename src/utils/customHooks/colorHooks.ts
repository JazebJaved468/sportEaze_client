import {useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';

export const useTextColor = () => {
  return useColorModeValue(appColors.black, appColors.white);
};

export const useInverseTextColor = () => {
  return useColorModeValue(appColors.white, appColors.black);
};

export const usePageBackgroundColor = () => {
  return useColorModeValue(appColors.white, appColors.charcoalBlue);
};
