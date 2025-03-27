import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {updateMessage} from '../../../store/sample/sample.slice';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {PlayerHomePage} from '../PlayerHome';
import UserPost from '../../../components/UserPost/UserPost';
import PageContainer from '../../../components/PageContainer';

export const PlayerProfile = () => {
  const navigation = useAppNavigation();
  return (
    <PageContainer>
      <View>
        <UserPost />

        <Button
          title={'Go Back'}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeText: {
    fontSize: 30,
    fontWeight: '700',
  },
});
