import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import Video, {VideoPlayerRef} from 'react-native-video-player';
import {ResizeMode} from 'react-native-video';
import {Button, View} from 'native-base';
import {useAppSelector} from '../../utils/customHooks/storeHooks';
import {
  APP_BOTTOM_BAR_HEIGHT,
  APP_HEADER_HEIGHT,
  AppStates,
} from '../../constants/core';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export type VideoBoxRef = {
  measureLayoutPosition: () => void;
};

type VideoProps = {
  url: string;
};

type LayoutPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

const VideoPlayer = forwardRef<VideoBoxRef, VideoProps>(({url}, ref) => {
  const {appState} = useAppSelector(state => state.core);

  const videoRef = useRef<VideoPlayerRef | null>(null);
  const videoBoxRef = useRef(null);

  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity is 0

  // Video Active when inside viewable area of the screen
  const [position, setPosition] = useState<LayoutPosition | null>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);

  const [pause, setPause] = useState(false);
  const [mute, setMute] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9); // Default aspect ratio

  // Loading time to calculate aspect ratio to render
  const [renderLoading, setRenderLoading] = useState(true);

  const upperThresoldValue = 0.3; // Video 20% of the screen
  const lowerThresoldValue = 0.9; // Video 90% on the screen

  const stopPlaying = () => {
    if (videoRef?.current) {
      videoRef?.current?.pause();
    }
  };

  const resumePlaying = () => {
    if (pause) return;
    if (videoRef?.current) {
      videoRef?.current?.resume();
    }
  };

  const onPause = () => {
    if (videoRef?.current && pause) {
      videoRef?.current?.resume();
      setPause(false);
    } else {
      videoRef?.current?.pause();
      setPause(true);
    }
  };

  const onEnd = () => {
    // Auto replay
    videoRef?.current?.seek(0);
    videoRef?.current?.resume();
  };

  const onMutePress = () => {
    if (videoRef?.current && mute) {
      // videoRef?.current?.setVolume(1);
      setMute(false);
    } else {
      // videoRef?.current?.setVolume(0);
      setMute(true);
    }
  };

  const onVideoLoad = (data: any) => {
    const {width, height} = data.naturalSize;
    if (width && height) {
      setVideoAspectRatio(width / height);
    }
    setRenderLoading(false); // Hide loader
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    // Pausing video when app goes to background
    if (appState === AppStates.BACKGROUND && videoRef?.current) {
      videoRef?.current?.pause();
      setPause(true);
    }
  }, [appState]);

  const measureBox = () => {
    videoBoxRef?.current?.measure(
      (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number,
      ) => {
        setPosition({x, y, width, height, pageX, pageY});
      },
    );

    if (!position) return;

    if (
      position?.pageY - APP_HEADER_HEIGHT < 0 &&
      Math.abs(position?.pageY - APP_HEADER_HEIGHT) -
        position?.height * upperThresoldValue >=
        0
    ) {
      // console.log('------------ 👆above screen ');
      setIsVideoActive(false);
      stopPlaying();
    } else if (
      position?.pageY >
      screenHeight -
        APP_BOTTOM_BAR_HEIGHT -
        position?.height * lowerThresoldValue
    ) {
      // console.log('------------ 👇🖐below screen ');
      setIsVideoActive(false);
      stopPlaying();
    } else {
      setIsVideoActive(true);
      resumePlaying();
    }
  };

  // Expose the measure function to parent
  useImperativeHandle(ref, () => ({
    measureLayoutPosition: measureBox,
  }));

  // console.log('video ref', videoRef.current);
  return (
    <View
      onLayout={measureBox}
      ref={videoBoxRef}
      style={{
        // minHeight: renderLoading ? 0 : screenWidth / videoAspectRatio,
        // // height: renderLoading ? 0 : screenWidth / videoAspectRatio,
        // // padding: 10,
        marginHorizontal: 16,
        // borderRadius: 16,
        // overflow: 'hidden',
      }}
      bg={isVideoActive ? 'green.600' : 'red.600'}>
      {renderLoading && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            width: '100%',
            height: 250,
            justifyContent: 'center',
            alignItems: 'center',
            // position: 'absolute',
          }}>
          <ActivityIndicator size='large' color='#000' />
        </View>
      )}

      <Animated.View
        style={{
          opacity: fadeAnim,
          backgroundColor: 'green',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
        <Video
          ref={(ref: VideoPlayerRef) => (videoRef.current = ref)}
          source={{
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
          // thumbnail={
          //   {
          //     // uri: 'https://res.cloudinary.com/dpe70dvug/image/upload/v1734864712/cld-sample-3.jpg',
          //   }
          // }
          paused={true}
          autoplay={false}
          // disableFullscreen={true}
          hideControlsOnStart
          controls={false}
          onLoad={onVideoLoad}
          disableControlsAutoHide
          muted={mute}
          resizeMode={ResizeMode.CONTAIN}
          style={{
            width: '100%',
            height: renderLoading ? 0 : screenWidth / videoAspectRatio, // Maintain aspect ratio
            alignSelf: 'center',
            backgroundColor: 'black',
          }}
          onEnd={onEnd}
          onProgress={e => {}}
          onError={e => {}}
          onBuffer={e => {}}
          // disableSeek
          // defaultMuted={mute}
          // playInBackground={false}
          // disableFocus
          // onLoadStart={async () => {
          //   await setMute(true);
          //   await setMute(true);
          // }}
          // volume={100}
          // onLoad={onVideoLoad}
          // onLoad={renderNaturalSize}
          // onMutePress={e => {
          //   console.log('onMutePress', e);
          //   setMute(e);
          // }}
          // hideControlsOnStart
          // pauseOnPress
          // showDuration
          // onAspectRatio={aspectRatio => {
          //   console.log('aspectRatio', aspectRatio);
          // }}
          // style={{
          //   aspectRatio: 1 / 2,
          //   width: '100%',
          //   height: 400,
          //   alignSelf: 'center',

          //   backgroundColor: 'green',
          // }}
          // style={{...videoStyle, width: '100%'}}
          // repeat={true}
          // loop={true}
          // paused={pause}
          // endWithThumbnail
          customStyles={{
            wrapper: {
              // borderRadius: 36,
              // overflow: 'hidden',
            },
            controls: {
              display: 'none',
            },
            seekBar: {
              display: 'none',
            },
          }}
        />
      </Animated.View>

      <Button
        m={5}
        height={50}
        onPress={() => {
          onPause();
        }}>
        Play/pause
      </Button>

      <Button
        m={5}
        height={50}
        onPress={() => {
          onMutePress();
        }}>
        mute
      </Button>
    </View>
  );
});

export default VideoPlayer;

const styles = StyleSheet.create({});

// useEffect(() => {
//   if (netinfo.isConnected && videoRef?.current) {
//     // console.log('intenret');
//     // videoRef?.current?.resume();
//     // videoRef?.current?.setSource({
//     //   uri: 'https://res.cloudinary.com/dpe70dvug/video/upload/v1735118800/zmdqlumgtd961spj59hn.mp4',
//     // });
//   }
//   // console.log('renderLoading', renderLoading);
//   // console.log('fadeAnim', fadeAnim);
// }, [netinfo.isConnected]);
