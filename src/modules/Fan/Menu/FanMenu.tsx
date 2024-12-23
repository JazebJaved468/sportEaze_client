import {StyleSheet, View} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import {Button, useColorMode} from 'native-base';
import {storeInLocalStorage} from '../../../utils/customHooks/helpers/asyncStorage';

export const FanMenu = () => {
  const {colorMode, setColorMode, toggleColorMode} = useColorMode();

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
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({});
