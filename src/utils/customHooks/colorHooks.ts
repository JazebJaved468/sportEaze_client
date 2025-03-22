import {useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';

export const useTextColor = () => {
  return useColorModeValue(appColors.black, appColors.white);
};

export const useInverseTextColor = () => {
  return useColorModeValue(appColors.white, appColors.black);
};

export const usePageBackgroundColor = () => {
  // return useColorModeValue(appColors.white, appColors.charcoalBlue);
  return useColorModeValue(appColors.white, appColors.gunmetal);
};

export const useCardColor = () => {
  return useColorModeValue(appColors.white, appColors.erieBlack);
};

export const useLightTextColor = () => {
  return useColorModeValue(appColors.lightBlack, appColors.lightWhite);
};

export const useDividerColor = () => {
  return useColorModeValue(appColors.dividerLight, appColors.dividerDark);
};
