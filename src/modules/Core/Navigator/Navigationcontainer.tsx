import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import {useColorMode} from 'native-base';
import {getFromLocalStorage} from '../../../utils/customHooks/helpers/asyncStorage';

export const Navigationcontainer: React.FC = () => {
  const {setColorMode} = useColorMode();
  const getColorMode = async () => {
    const colorMode =
      (await getFromLocalStorage({key: 'colorMode'})) || 'light';

    setColorMode(colorMode);
  };

  useEffect(() => {
    getColorMode();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default Navigationcontainer;

const styles = StyleSheet.create({});
