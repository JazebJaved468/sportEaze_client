import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {appColors} from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import {screenHeight, screenWidth} from '../../constants/styles';
import {useColorModeValue} from 'native-base';
import PageContainer from '../PageContainer';
import {customWidth} from '../../styles/responsiveStyles';

export const SplashScreen = () => {
  const shadowColor = useColorModeValue(appColors.black, appColors.white);

  return (
    <PageContainer>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: appColors.white,
        }}>
        <View style={styles.shadowContainer}>
          <LinearGradient
            start={{x: 0.5, y: 5}} // Start from bottom center
            end={{x: 0.5, y: 0}}
            colors={[shadowColor, appColors.transparent]}>
            <View
              style={{
                width: screenWidth,
                height: screenHeight,
              }}
            />
          </LinearGradient>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/splash_logo_duo.png')}
            style={{
              width: screenWidth - customWidth(130),
              objectFit: 'contain',
            }}
          />
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
});
