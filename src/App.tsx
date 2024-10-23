import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import AppNavigator from './modules/Core/Navigator/AppNavigator';
import {Provider} from 'react-redux';
import {store} from './store/store';
import {NativeBaseProvider} from 'native-base';
import {theme} from './styles/nativeBaseCustomizeStyles/customizeTheme';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <SafeAreaView style={styles.safeArea}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
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
