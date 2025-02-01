import {StyleSheet, View} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import {Button, useColorMode} from 'native-base';
import {storeInLocalStorage} from '../../../utils/helpers/asyncStorage';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {OnBoardingPage} from '../../Core/OnBoarding';

export const FanMenu = () => {
  const {colorMode, setColorMode, toggleColorMode} = useColorMode();
  const navigation = useAppNavigation();
  return (
    <PageContainer>
      <View style={{justifyContent: 'center', flex: 1}}>
        <Button
          m={10}
          py={3}
          onPress={() => {
            toggleColorMode();
            storeInLocalStorage({
              key: 'colorMode',
              value: colorMode === 'light' ? 'dark' : 'light',
            });
          }}>
          Switch Color Mode
        </Button>

        <Button
          m={10}
          py={3}
          onPress={() => {
            navigation.navigate(OnBoardingPage);
          }}>
          On boarding screen
        </Button>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({});
