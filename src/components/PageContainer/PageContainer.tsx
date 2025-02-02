import {Dimensions, StyleSheet, View} from 'react-native';
import React, {ReactNode} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';

type PageContainerProps = {
  children: ReactNode;
  backgroundColor?: string;
  applyGradient?: boolean;
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export const PageContainer = ({
  children,
  backgroundColor,
  applyGradient,
}: PageContainerProps) => {
  const pageBackgroundColor = useColorModeValue(
    appColors.white,
    appColors.charcoalBlue,
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: backgroundColor ?? pageBackgroundColor,
        flex: 1,
      }}>
      {children}

      {applyGradient ? (
        <View style={{position: 'absolute', left: 0, top: 0, zIndex: -1}}>
          <LinearGradient
            start={{x: 0, y: 2}}
            end={{x: 0, y: 0.7}}
            colors={[appColors.black, appColors.transparent]}>
            <View
              style={{
                width: screenWidth,
                height: screenHeight,
              }}
            />
          </LinearGradient>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
