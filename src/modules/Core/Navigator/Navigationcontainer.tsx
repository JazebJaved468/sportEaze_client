import {AppState, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import {useColorMode} from 'native-base';
import {getFromLocalStorage} from '../../../utils/helpers/asyncStorage';
import SplashScreen from '../../../components/SplashScreen';
import {AppStates} from '../../../constants/core';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../utils/customHooks/storeHooks';
import {updateAppState, updateFirstVisit} from '../../../store/core/core.slice';
import {
  updateIsLoggedIn,
  updateUser,
  updateUserToken,
  updateUserType,
} from '../../../store/auth/auth.slice';
import {useLazyGetUserSettingsQuery} from '../../../store/auth/auth.service';
import {Toast} from '../../../components/Toast';
import {USER_TYPE} from '../../../constants/enums';
import {
  connectSocket,
  disconnectSocket,
} from '../../../store/socket/socket.service';

export const Navigationcontainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const {isLoggedIn} = useAppSelector(state => state.auth);
  const {setColorMode} = useColorMode();

  const [appLoading, setAppLoading] = useState(true);

  const [getUserSettings] = useLazyGetUserSettingsQuery();

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

  const checkIsLoggedIn = async () => {
    const userToken = await getFromLocalStorage({key: 'userToken'});
    const userType = await getFromLocalStorage({key: 'userType'});
    console.log(
      `Success ---------------> From Local Storage : userToken : ${userToken}`,
    );
    console.log(
      `Success ---------------> From Local Storage : userType : ${userType}`,
    );

    if (userToken) {
      try {
        console.log('User Logged In');
        dispatch(updateUserToken(userToken));
        dispatch(updateUserType(Number(userType) || USER_TYPE.FAN));
        dispatch(updateIsLoggedIn(true));

        await getUserSettings().unwrap();
      } catch (error) {
        console.log('Error while fetching User  : ', error);
      }
    }

    // return {
    //   isLoggedIn: userToken ? true : false,
    //   userType: userToken ? userType : null,
    // };
  };

  useEffect(() => {
    try {
      console.log('connecting socket : ', isLoggedIn);
      if (isLoggedIn) {
        connectSocket(); // Connect on mount
      } else {
        disconnectSocket();
      }
    } catch (error) {
      console.log('Error while connecting socket : ', error);
    }

    return () => disconnectSocket(); // Cleanup on unmount
  }, [isLoggedIn]);

  useEffect(() => {
    loadApp();
  }, []);

  const loadApp = async () => {
    const [colorModeResponse, isFirstVisitResponse, isLoggedInResponse] =
      await Promise.all([
        getColorMode(),
        checkIsFirstVisit(),
        checkIsLoggedIn(),
      ]); // add calls that are independent of each other

    // await new Promise(resolve => setTimeout(resolve, 1000));
    setAppLoading(false);
  };

  if (appLoading) {
    return (
      <>
        <SplashScreen />
        <Toast />
      </>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
      <Toast />
    </NavigationContainer>
  );
};

export default Navigationcontainer;

const styles = StyleSheet.create({});
