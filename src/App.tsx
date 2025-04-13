import React from 'react';
import {StyleSheet} from 'react-native';

import {Provider} from 'react-redux';
import {store} from './store/store';
import {NativeBaseProvider} from 'native-base';
import {theme} from './styles/nativeBaseCustomizeStyles/customizeTheme';
import Navigationcontainer from './modules/Core/Navigator/Navigationcontainer';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <GestureHandlerRootView style={{flex: 1}}>
          <Navigationcontainer />
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
