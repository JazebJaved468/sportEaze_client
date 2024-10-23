import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import AppNavigator from './modules/Core/Navigator/AppNavigator';
import {Provider} from 'react-redux';
import {store} from './store/store';
import {NativeBaseProvider, useColorMode} from 'native-base';
import {theme} from './styles/nativeBaseCustomizeStyles/customizeTheme';
import {getFromLocalStorage} from './utils/customHooks/helpers/asyncStorage';
import Navigationcontainer from './modules/Core/Navigator/Navigationcontainer';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <SafeAreaView style={styles.safeArea}>
          <Navigationcontainer />
        </SafeAreaView>
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
