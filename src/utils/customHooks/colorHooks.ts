import {useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';

export const useTextColor = () => {
  const textColor = useColorModeValue(appColors.black, appColors.white);
  return textColor;
};
