import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../modules/Core/Navigator/AppNavigator/AppNavigator';
import {useNavigation} from '@react-navigation/native';

export const useAppNavigation = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return navigation;
};
