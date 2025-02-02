import {StyleSheet, Text, View} from 'react-native';
import React, {MutableRefObject, useRef} from 'react';
import PageContainer from '../../../components/PageContainer';
import UserPost from '../../../components/UserPost/UserPost';
import {Button, FlatList, ScrollView} from 'native-base';
import GeneralHeader from '../../../components/GeneralHeader';
import VideoPlayer from '../../../components/VideoPlayer';
import {useBecomePlayerMutation} from '../../../store/auth/auth.service';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {JoinAsPage} from '../Auth/JoinAs';

export const PostFeed = () => {
  // const onScroll = (event: any) => {

  //   if (childRef.current) {
  //     childRef.current.measureLayoutPosition(); // Call child function
  //   }
  // };

  // const childRef = useRef(null);
  const [becomePlayer] = useBecomePlayerMutation();

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
  const setChildRef = (id: number) => (ref: ChildRef | null) => {
    if (ref) {
      childRefs.current[id] = ref;
    }
  };

  const convertToPlayer = async () => {
    const res = await becomePlayer();

    console.log('res', res);
  };

  const navigation = useAppNavigation();

  return (
    <PageContainer>
      <GeneralHeader showLeftElement={false} titleAlign='left' />

      <FlatList
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={[1]}
        renderItem={({item}) => {
          return (
            <VideoPlayer key={item} ref={setChildRef(item)} url='' id={item} />
          );
        }}
      />

      <Button
        onPress={() => {
          convertToPlayer();
        }}>
        Become A Player
      </Button>

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

const styles = StyleSheet.create({});
