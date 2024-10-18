import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {PlayerProfilePage} from '.';
import {updateMessage} from '../../../store/sample/sample.slice';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {PlayerHomePage} from '../PlayerHome';

export const PlayerProfile = () => {
  const navigation = useAppNavigation();
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <Text style={styles.homeText}>Sample PlayerProfile</Text>
      </View>

      <Button
        title={'Go Back'}
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
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
