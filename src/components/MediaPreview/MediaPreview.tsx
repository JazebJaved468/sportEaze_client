import {BackHandler, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../modules/Core/Navigator/AppNavigator/AppNavigator';
import {useAppNavigation} from '../../utils/customHooks/navigator';
import {useTextColor} from '../../utils/customHooks/colorHooks';
import PageContainer from '../PageContainer';
import {CrossIcon, TickIcon} from '../../assets/icons';
import {Button, DeleteIcon} from 'native-base';
import {fontBold, fontRegular} from '../../styles/fonts';
import {appColors} from '../../constants/colors';
import {MediaType} from '../../constants/enums';
import VideoPlayer from '../VideoPlayer';
import {PulseEffect} from '../PulseEffect';

type MediaPreviewPageRouteProp = RouteProp<
  RootStackParamList,
  'MediaPreviewPage'
>;

export const MediaPreview = () => {
  const {params} = useRoute<MediaPreviewPageRouteProp>();
  const navigation = useAppNavigation();

  const textColor = useTextColor();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  console.log('params', params);
  return (
    <PageContainer>
      <View style={styles.imageContainer}>
        {params.mediaType === MediaType.IMAGE && (
          <Image
            style={styles.image}
            source={{
              uri: params.mediaPath,
            }}
          />
        )}

        {params.mediaType === MediaType.VIDEO && (
          <View style={{width: '100%'}}>
            <VideoPlayer url={params.mediaPath} id={1} />
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 16,
          gap: 16,
        }}>
        <Button
          style={[
            styles.button,
            {
              borderWidth: 1,
              borderColor: appColors.warmRed,
              backgroundColor: appColors.transparent,
            },
          ]}
          p={0}
          py={0}
          onPress={() => {
            params.onRemove?.();
            navigation.goBack();
          }}>
          <View style={styles.buttonInnerWrapper}>
            <DeleteIcon
              width={20}
              height={20}
              strokeWidth={2}
              color={appColors.warmRed}
            />
            <Text style={fontRegular(16, appColors.warmRed)}>Remove</Text>
          </View>
        </Button>

        <Button
          style={styles.button}
          p={0}
          py={0}
          onPress={() => {
            navigation.goBack();
          }}>
          <View style={styles.buttonInnerWrapper}>
            <TickIcon
              width={16}
              height={16}
              strokeWidth={2}
              color={appColors.white}
            />
            <Text style={fontRegular(16, appColors.white)}>Ok</Text>
          </View>
        </Button>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  buttonInnerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    height: 48,
    padding: 0,
    // marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 20,
    flex: 1,
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
