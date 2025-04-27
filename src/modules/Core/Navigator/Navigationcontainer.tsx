import {AppState, BackHandler, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import {Button, useColorMode, View} from 'native-base';
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
import {useLazyGetAvailableSportsQuery} from '../../../store/core/core.service';
import {navigationRef} from '../../../utils/helpers/navigation';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useLazyGetAppSettingsQuery} from '../../../store/superAdmin/superAdmin.service';
import {CustomModal} from '../../../components/CustomModal/CustomModal';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {useTextColor} from '../../../utils/customHooks/colorHooks';
import {customHeight} from '../../../styles/responsiveStyles';
import {appColors} from '../../../constants/colors';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';

export const Navigationcontainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const {isLoggedIn, user} = useAppSelector(state => state.auth);
  const {setColorMode} = useColorMode();

  const [appLoading, setAppLoading] = useState(true);

  const [getUserSettings] = useLazyGetUserSettingsQuery();
  const [getAvailableSports] = useLazyGetAvailableSportsQuery();
  const [getAppSettings, {data: appSettings}] = useLazyGetAppSettingsQuery();

  const [gdprmodalVisible, setGdprModalVisible] = useState(false);

  const textColor = useTextColor();

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
    if (
      appSettings &&
      (appSettings?.allowDeleteUser === false ||
        appSettings?.allowUpdateUser === false ||
        appSettings?.shouldTakeConsent === false) &&
      user?.userType !== USER_TYPE.SUPER_ADMIN
    ) {
      setGdprModalVisible(true);
    }
  }, [appSettings]);

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
        dispatch(updateUserType(Number(userType) || USER_TYPE.GENERAL));
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
    try {
      loadApp();
    } catch (error) {
      console.log('Error while loading App : ', error);
    }
  }, []);

  const loadApp = async () => {
    // calls that we dont want to wait for
    getAvailableSports().unwrap();
    getAppSettings().unwrap();

    // calls that we want to wait for
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
    <NavigationContainer ref={navigationRef}>
      <BottomSheetModalProvider>
        <AppNavigator />
        <Toast />
      </BottomSheetModalProvider>

      <CustomModal
        modalVisible={gdprmodalVisible}
        setModalVisible={setGdprModalVisible}
        modalHeading='WARNING !'>
        <View>
          <Text style={[fontRegular(16, textColor)]}>
            This app is not GDPR compliant. Are you sure you want to continue?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginTop: customHeight(30),
            }}>
            <Button
              onPress={() => {
                BackHandler.exitApp();
              }}
              style={[
                styles.actionButton,
                {
                  backgroundColor: appColors.transparent,
                  borderWidth: 1,
                  borderColor: appColors.warmRed,
                  flex: 1,
                },
              ]}>
              <Text style={fontBold(14, appColors.warmRed)}>Close App</Text>
            </Button>

            <Button
              onPress={() => {
                setGdprModalVisible(false);
              }}
              style={[styles.actionButton, {flex: 1}]}>
              <Text style={fontBold(14, appColors.white)}>Continue Using</Text>
            </Button>
          </View>
        </View>
      </CustomModal>
    </NavigationContainer>
  );
};

export default Navigationcontainer;

const styles = StyleSheet.create({
  actionButton: {height: customHeight(48), borderRadius: BUTTON_BORDER_RADIUS},
});
