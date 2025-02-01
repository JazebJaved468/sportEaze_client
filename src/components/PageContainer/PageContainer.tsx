import {StyleSheet} from 'react-native';
import React, {ReactNode} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';

export const PageContainer = ({children}: {children: ReactNode}) => {
  const pageBackgroundColor = useColorModeValue(
    appColors.white,
    appColors.charcoalBlue,
  );

  return (
    <SafeAreaView style={{backgroundColor: pageBackgroundColor, flex: 1}}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
