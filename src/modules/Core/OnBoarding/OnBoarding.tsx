import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import PageContainer from '../../../components/PageContainer';
import {appColors} from '../../../constants/colors';
import {PlayerModelIcon, ScarIcon} from '../../../assets/icons';
import {Button, useColorModeValue} from 'native-base';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import LinearGradient from 'react-native-linear-gradient';
import {
  onBoardingData,
  OnBoardingDataType,
} from '../../../constants/onBoarding';
import {storeInLocalStorage} from '../../../utils/helpers/asyncStorage';
import {FanRootPage} from '../../Fan/Root';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {fontBold, fontExtraBold, fontRegular} from '../../../styles/fonts';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export const OnBoarding = () => {
  const navigation = useAppNavigation();

  const scrollX = useRef(new Animated.Value(0)).current;

  const shadowColor = useColorModeValue(appColors.warmRed, appColors.white);
  const containerColor = useColorModeValue(
    appColors.white,
    appColors.charcoalBlue,
  );
  const textColor = useColorModeValue(appColors.black, appColors.white);
  const inActiveDotColor = useColorModeValue(appColors.black, appColors.white);
  const inActiveDotColorInverse = useColorModeValue(
    appColors.white,
    appColors.black,
  );

  // Prevent back navigation using hardware back button or gesture
  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {onBoardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * screenWidth,
            index * screenWidth,
            (index + 1) * screenWidth,
          ];
          const dotScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.5, 0.8],
            easing: Easing.inOut(Easing.ease),
            // easing: Easing.bezier(0.42, 0, 0.58, 1),
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            easing: Easing.inOut(Easing.ease),
            extrapolate: 'clamp',
          });
          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: [
              inActiveDotColor,
              appColors.warmRed,
              inActiveDotColorInverse,
            ],
            easing: Easing.inOut(Easing.ease),
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {backgroundColor: dotColor},
                {transform: [{scale: dotScale}], opacity: dotOpacity},
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderItem = ({item}: {item: OnBoardingDataType}) => {
    return (
      <View style={[styles.slide]}>
        <View
          style={{
            height: screenHeight - customHeight(280),
            overflow: 'hidden',
          }}>
          <item.image />
        </View>

        <View style={styles.content}>
          <Text style={fontExtraBold(42, textColor)}>{item.title}</Text>
          <Text
            style={[fontRegular(16, textColor), {marginTop: customHeight(16)}]}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {
      useNativeDriver: false, // Set this to true if you don't need animations directly
    },
  );

  return (
    <PageContainer>
      <StatusBar hidden={false} />
      <View style={[styles.container, {backgroundColor: containerColor}]}>
        <View style={styles.shadowContainer}>
          <LinearGradient
            start={{x: -1.8, y: 0}}
            end={{x: 0, y: 0.8}}
            colors={[shadowColor, appColors.transparent]}>
            <View
              style={{
                width: screenWidth,
                height: screenHeight,
              }}
            />
          </LinearGradient>
        </View>

        <View style={styles.scarContainer}>
          <ScarIcon />
        </View>

        {/* remove ths static view */}
        {/* <View style={styles.modelContainer}>
          <PlayerModelIcon />
        </View> */}

        <View style={styles.swiperContainer}>
          <FlatList
            data={onBoardingData}
            scrollEventThrottle={16}
            keyExtractor={item => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            onScroll={onScroll}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.paginationAndSkipContainer}>
            {renderPagination()}

            <Button
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{name: FanRootPage}],
                });
                storeInLocalStorage({
                  key: 'isFirstVisit',
                  value: 'false',
                });
              }}
              style={styles.skip}>
              <Text
                style={{
                  color: appColors.warmRed,
                  fontFamily: 'LatoRegular',
                  padding: 8,
                }}>
                Skip
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadow: {
    shadowOffset: {
      width: 100,
      height: 100,
    },
    shadowOpacity: 0.2,
    shadowRadius: 100,
  },

  shadowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
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
    top: 80,
    opacity: 1,
  },
  content: {
    marginLeft: customWidth(16),
    marginRight: customWidth(24),
    marginTop: customHeight(30),
  },

  // swiper
  swiperContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    marginTop: customHeight(70),
  },
  slide: {
    width: screenWidth,
    // backgroundColor: 'red',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  paginationAndSkipContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 24,
  },
  footer: {
    marginTop: screenHeight - 70,
    marginHorizontal: 16,
  },
  skip: {
    borderRadius: 12,
    backgroundColor: appColors.transparent,
    alignSelf: 'flex-end',
  },
});
