import React, {useCallback, useEffect, useRef} from 'react';
import {Button, SafeAreaView, StyleSheet, Text} from 'react-native';

import AppNavigator from './modules/Core/Navigator/AppNavigator';
import {Provider} from 'react-redux';
import {store} from './store/store';
import {NativeBaseProvider, useColorMode} from 'native-base';
import {theme} from './styles/nativeBaseCustomizeStyles/customizeTheme';
import {getFromLocalStorage} from './utils/customHooks/helpers/asyncStorage';
import Navigationcontainer from './modules/Core/Navigator/Navigationcontainer';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ReducedMotionConfig, ReduceMotion} from 'react-native-reanimated';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <GestureHandlerRootView style={{flex: 1}}>
          <BottomSheetModalProvider>
            <Navigationcontainer />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </NativeBaseProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;
