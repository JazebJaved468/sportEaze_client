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
import {ScarIcon, SportEazeLogo} from '../../../assets/icons';
import {Button, useColorModeValue} from 'native-base';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import LinearGradient from 'react-native-linear-gradient';
import {OnBoardingDataType} from '../../../constants/onBoarding';
import {storeInLocalStorage} from '../../../utils/helpers/asyncStorage';
import {FanRootPage} from '../../Fan/Root';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {fontBold, fontExtraBold, fontRegular} from '../../../styles/fonts';
import {PulseEffect} from '../../../components/PulseEffect';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export const onBoardingData: OnBoardingDataType[] = [
  {
    id: 1,
    title: 'Shine On & Be Seen!',
    description:
      'Share your achievements, skills, and story. Build your fanbase and rise to stardom!',

    imageKey: 'player',
  },
  {
    id: 2,
    title: 'Fuel the Future of Sports',
    description:
      ' Discover raw talent and empower athletes with the resources they need to thrive.',

    imageKey: 'patron',
  },
  {
    id: 3,
    title: 'Shape Champions',
    description:
      'Guide upcoming players with your experience. Offer mentorship and give your endorsement.',

    imageKey: 'mentor',
  },
  {
    id: 4,
    title: 'Back Your Heroes',
    description:
      ' Cheer for your favorite athletes, share their journey, and give them the spotlight they deserve!',

    imageKey: 'fan',
  },
];

const IMAGES = {
  player: require('../../../assets/images/player_onboard.png'),
  patron: require('../../../assets/images/patron_onboard.png'),
  mentor: require('../../../assets/images/mentor_onboard.png'),
  fan: require('../../../assets/images/fan_onboard.png'),
};

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
    // appColors.black,
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
            justifyContent: 'center',
            alignItems: 'center',
            width: screenWidth - 32,

            marginHorizontal: customWidth(16),
            borderRadius: 20,
            overflow: 'hidden',
          }}>
          <Image
            source={IMAGES[item.imageKey as keyof typeof IMAGES]}
            style={{
              width: screenWidth,
              height: screenHeight - customHeight(100),
              objectFit: 'cover',
              borderRadius: 20,
              opacity: 1,
            }}
          />
          {/* <item.image /> */}
        </View>

        <View
          style={[styles.content, {backgroundColor: `${appColors.warmRed}90`}]}>
          <Text style={fontExtraBold(28, appColors.white)}>{item.title}</Text>
          <Text
            style={[
              fontRegular(15, appColors.white),
              {marginTop: customHeight(16), lineHeight: 20},
            ]}>
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
        <View
          style={{
            justifyContent: 'flex-end',
            paddingVertical: customHeight(10),
            paddingHorizontal: customWidth(24),
            flexDirection: 'row',
            alignItems: 'center',
            gap: customWidth(6),
          }}>
          <Text style={fontBold(12, textColor)}>SportEaze</Text>
          <SportEazeLogo width={30} height={30} color={textColor} />
        </View>

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

            <View
              style={{
                position: 'absolute',
                right: 0,
                zIndex: 1,
              }}>
              <PulseEffect>
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
              </PulseEffect>
            </View>
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
    top: customHeight(10),
    opacity: 0.7,
  },
  modelContainer: {
    position: 'absolute',
    left: 0,
    top: 80,
    opacity: 1,
  },
  content: {
    marginLeft: customWidth(30),
    marginRight: customWidth(44),
    marginBottom: customHeight(10),
    marginTop: 'auto',
    paddingBottom: customHeight(28),
    paddingHorizontal: customWidth(16),
    paddingTop: customHeight(16),
    borderRadius: 20,
  },

  // swiper
  swiperContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  slide: {
    width: screenWidth,
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
    marginBottom: customHeight(26),
    marginTop: customHeight(26),
  },
  footer: {
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  skip: {
    borderRadius: 12,
    backgroundColor: appColors.transparent,
    alignSelf: 'flex-end',
  },
});
