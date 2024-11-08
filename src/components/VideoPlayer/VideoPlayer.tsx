import {Dimensions, SafeAreaView, StyleSheet, Text} from 'react-native';
import React from 'react';
import {View} from 'native-base';
import Video from 'react-native-video';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

type VideoPlayerProps = {
  url: string;
  color: string;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({url, color}) => {
  return (
    <View
      style={{
        width: width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color,
      }}>
      <Text>{url}</Text>
      <View style={{width: 350, height: 400, backgroundColor: 'red'}}>
        <Video
          onBuffer={() => {
            console.log('buffering');
          }}
          source={{uri: 'src/assets/videos/sample_video.mp4'}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
