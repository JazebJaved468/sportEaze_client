import {StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {bg} from 'date-fns/locale';
import {useColorMode, useColorModeValue} from 'native-base';
import {appcolors} from '../../constants/colors';

export const PageContainer = ({children}: {children: ReactNode}) => {
  const pageBackgroundColor = useColorModeValue(
    appcolors.white,
    appcolors.black,
  );

  return (
    <SafeAreaView style={{backgroundColor: pageBackgroundColor, flex: 1}}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
