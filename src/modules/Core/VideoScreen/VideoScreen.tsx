import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  ViewToken,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {View} from 'native-base';
import {Dimensions} from 'react-native';
import Video, {ResizeMode} from 'react-native-video';
import VideoPlayer from '../../../components/VideoPlayer';

const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type VideoType = {
  id: number;
  url: string;
  color: string;
};

export const VideoScreen = () => {
  const videos: VideoType[] = [
    {id: 1, url: '123', color: 'yellow'},
    {id: 2, url: '456', color: 'orange'},
    {id: 3, url: '789', color: 'pink'},
  ];

  const flatListRef = useRef<FlatList<VideoType>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Callback to detect fully visible items
  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: ViewToken<VideoType>[]}) => {
      console.log('viewable items', viewableItems);
      if (viewableItems.length > 0) {
        const nextIndex = viewableItems[0].index;
        if (nextIndex !== null) setCurrentIndex(nextIndex);
      }
    },
    [],
  );

  // Viewability config
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80, // Trigger when 80% of item is visible
  };

  // Snap scroll handler to change screen on scroll end
  const handleSnapScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / screenHeight);
    console.log('scrolled', newIndex);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({index: newIndex, animated: true});
    }
  };

  return (
    <View>
      <FlatList
        alwaysBounceVertical={false}
        bounces={false}
        data={videos}
        renderItem={({item, index}) => {
          return <VideoPlayer url={item.url} color={item.color} />;
        }}
        ref={flatListRef}
        keyExtractor={(item, index) => item.id.toString()}
        snapToInterval={screenHeight}
        decelerationRate='normal'
        pagingEnabled
        onScrollEndDrag={handleSnapScroll}
        onMomentumScrollEnd={handleSnapScroll}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
