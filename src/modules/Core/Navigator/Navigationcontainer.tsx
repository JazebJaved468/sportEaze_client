import {AppState, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import {useColorMode} from 'native-base';
import {getFromLocalStorage} from '../../../utils/customHooks/helpers/asyncStorage';
import SplashScreen from '../../../components/SplashScreen';
import {AppStates} from '../../../constants/core';
import {useAppDispatch} from '../../../utils/customHooks/storeHooks';
import {updateAppState, updateFirstVisit} from '../../../store/core/core.slice';

export const Navigationcontainer: React.FC = () => {
  const dispatch = useAppDispatch();
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
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove(); // Clean up listener
    };
  }, []);

  const handleAppStateChange = (appState: string) => {
    console.log('AppState : ---------------->', appState); // Log the current state

    dispatch(updateAppState(appState));

    if (appState === AppStates.ACTIVE) {
    } else {
    }
  };

  const checkIsFirstVisit = async () => {
    const isFirstVisit =
      (await getFromLocalStorage({key: 'isFirstVisit'})) || 'true';

    console.log(
      `Success ---------------> From Local Storage : get isFirstVisit : ${isFirstVisit}`,
    );

    dispatch(updateFirstVisit(isFirstVisit === 'true'));
  };

  useEffect(() => {
    loadApp();
  }, []);

  const loadApp = async () => {
    const [colorModeResponse, isFirstVisitResponse] = await Promise.all([
      getColorMode(),
      checkIsFirstVisit(),
    ]); // add calls that are independent of each other

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
