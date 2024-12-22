import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import {useColorMode} from 'native-base';
import {getFromLocalStorage} from '../../../utils/customHooks/helpers/asyncStorage';
import SplashScreen from '../../../components/SplashScreen';

export const Navigationcontainer: React.FC = () => {
  const {setColorMode} = useColorMode();

  const [appLoading, setAppLoading] = React.useState(true);

  const getColorMode = async () => {
    const colorMode =
      (await getFromLocalStorage({key: 'colorMode'})) || 'light';

    setColorMode(colorMode);
    console.log(
      `Success ---------------> From Local Storage : get colorMode : ${colorMode}`,
    );
    return `Color Mode Success`;
  };

  useEffect(() => {
    loadApp();
  }, []);

  const loadApp = async () => {
    const [colorModeResponse] = await Promise.all([getColorMode()]); // add calls that are independent of each other

    await new Promise(resolve => setTimeout(resolve, 1000));
    setAppLoading(false);
  };

  if (appLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default Navigationcontainer;

const styles = StyleSheet.create({});
