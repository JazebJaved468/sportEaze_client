import {StyleSheet, FlatList} from 'react-native';
import React, {MutableRefObject, useEffect, useRef} from 'react';
import PageContainer from '../../../components/PageContainer';
import UserPost from '../../../components/UserPost/UserPost';
import GeneralHeader from '../../../components/GeneralHeader';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {useGetPostFeedInfiniteQuery} from '../../../store/core/core.service';
import PullToRefresh from '../../../components/PullToRefresh';
import {Loader} from '../../../components/Loader';
import {Button} from 'native-base';
import {PulseEffect} from '../../../components/PulseEffect';
import {appColors} from '../../../constants/colors';
import {fontRegular} from '../../../styles/fonts';
import {useTextColor} from '../../../utils/customHooks/colorHooks';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';

export const PostFeed = () => {
  const {user, isLoggedIn} = useAppSelector(state => state.auth);
  // const onScroll = (event: any) => {

  //   if (childRef.current) {
  //     childRef.current.measureLayoutPosition(); // Call child function
  //   }
  // };

  // const childRef = useRef(null);

  type ChildRef = {
    measureLayoutPosition: () => void;
  };

  const childRefs: MutableRefObject<{[key: string]: ChildRef | null}> = useRef(
    {},
  ); // Object to store refs dynamically

  const handleScroll = () => {
    // Call measureLayoutPosition on each child during scroll
    Object.values(childRefs.current).forEach(ref => {
      ref?.measureLayoutPosition();
    });
  };

  // Set these refs only for Videos posts
  const setChildRef = (id: number | string) => (ref: ChildRef | null) => {
    if (ref) {
      childRefs.current[id] = ref;
    }
  };

  const navigation = useAppNavigation();

  const {
    data: posts,
    isLoading: postsCIP,
    isFetching: postsFIP,
    isFetchingNextPage: postsNextPageFIP,

    fetchNextPage,
    refetch: refetchPostFeed,
  } = useGetPostFeedInfiniteQuery();

  useEffect(() => {
    // Refresh feed when user account changes
    refetchPostFeed();
  }, [isLoggedIn]);

  const mergedData = {
    posts: posts?.pages.flatMap(page => page) ?? [],
  };

  // const numberOfPages = posts?.pages.length ?? 0;

  const textColor = useTextColor();

  const handleFetchMore = () => {
    if (postsCIP) return;
    fetchNextPage();
  };

  return (
    <PageContainer>
      <GeneralHeader showLeftElement={false} titleAlign='left' />

      {/* {postsCIP || (postsFIP && !postsNextPageFIP) ? ( */}
      {postsCIP ? (
        <Loader />
      ) : (
        <FlatList
          onScroll={handleScroll}
          scrollEventThrottle={16}
          data={mergedData.posts}
          refreshControl={
            <PullToRefresh
              onRefresh={async () => {
                refetchPostFeed();
              }}
            />
          }
          keyExtractor={item => `${item.id}-${item.sharedId}`}
          renderItem={({item}) => {
            return (
              // <VideoPlayer
              //   key={item.id}
              //   ref={setChildRef(item.id)}
              //   url=''
              //   id={item.id}
              // />

              <UserPost post={item} />
            );
          }}
          ListFooterComponent={
            <PulseEffect>
              <Button
                isDisabled={postsCIP || postsNextPageFIP || postsFIP}
                onPress={handleFetchMore}
                isLoading={postsNextPageFIP || postsFIP}
                _spinner={{
                  color: appColors.warmRed,
                }}
                style={styles.seeMore}
                _text={fontRegular(12, textColor)}>
                See More
              </Button>
            </PulseEffect>
          }
        />
      )}

      {/* <ScrollView onScroll={handleScroll}>
        {[1, 2, 3].map(id => (
          <VideoPlayer key={id} ref={setChildRef(id)} url='' id={id} />
        ))}
      </ScrollView> */}

      {/* <ScrollView onScroll={handleScroll}>
       
        {[1, 2, 3].map(id => (
          <VideoPlayer key={id} ref={setChildRef(id)} url='' />
        ))}

        <View style={{width: '100%', height: 100}} />
        <View style={{width: '100%', height: 100}} />
        <View style={{width: '100%', height: 100}} />
        <View style={{width: '100%', height: 100}} />
        <View style={{width: '100%', height: 100}} />
        <View style={{width: '100%', height: 100}} />
        <View style={{width: '100%', height: 100}} />
        <View style={{width: '100%', height: 100}} />
        <View style={{width: '100%', height: 100}} />
      </ScrollView> */}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  seeMore: {
    height: 40,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: `${appColors.warmRed}30`,
  },
});
