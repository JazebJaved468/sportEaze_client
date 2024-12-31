import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import DropShadow from 'react-native-drop-shadow';
import {appColors} from '../../../constants/colors';
import {PlayerModelIcon, ScarIcon} from '../../../assets/icons';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export const OnBoarding = () => {
  return (
    <PageContainer>
      <StatusBar hidden={false} />
      <View style={styles.container}>
        <View style={styles.shadowContainer}>
          <DropShadow style={styles.shadow}>
            <View style={styles.shadowShape} />
          </DropShadow>
        </View>

        <View style={styles.scarContainer}>
          <ScarIcon />
        </View>

        <View style={styles.modelContainer}>
          <PlayerModelIcon />
        </View>

        <View style={styles.content}>
          <Text
            style={{
              color: appColors.white,
              fontSize: 42,
              fontFamily: 'LatoBlack',
            }}>
            SportEaze
          </Text>
          <Text
            style={{
              color: appColors.white,
              fontSize: 16,
              marginTop: 16,
              fontFamily: 'LatoRegular',
            }}>
            Your one stop solution forg all your sports entertainment needs
          </Text>
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.charcoalBlue,
  },

  shadow: {
    shadowColor: appColors.white,
    shadowOffset: {
      width: 100,
      height: 100,
    },
    shadowOpacity: 0.2,
    shadowRadius: 100,
  },
  shadowContainer: {
    position: 'absolute',
    left: -300,
    top: -300,
  },
  shadowShape: {
    width: 350,
    height: 300,
    borderBottomRightRadius: 100,
    backgroundColor: appColors.charcoalBlue,
  },
  scarContainer: {
    position: 'absolute',
    right: 0,
    top: 10,
    opacity: 0.7,
  },
  modelContainer: {
    position: 'absolute',
    left: 0,
    top: 100,
    opacity: 1,
  },
  content: {
    marginTop: screenHeight - 180,
    marginHorizontal: 16,
  },
});
