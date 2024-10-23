import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {PlayerProfilePage} from '../PlayerProfile';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../utils/customHooks/storeHooks';
import {set} from 'date-fns';
import {updateMessage} from '../../../store/sample/sample.slice';
import {useGetSampleColorsQuery} from '../../../store/sample/sample.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFromLocalStorage,
  storeInLocalStorage,
} from '../../../utils/customHooks/helpers/asyncStorage';

const PlayerHome = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const {message} = useAppSelector(state => state.sample);

  const {data, isLoading} = useGetSampleColorsQuery();

  console.log('data from api', data);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <Text style={styles.homeText}>Sample Home</Text>
        <Button
          title={'set color mode'}
          onPress={() => {
            storeInLocalStorage({key: 'colorMode', value: 'dark'});
            // dispatch(updateMessage('Go to Player profile'));
          }}
        />
      </View>

      <Button
        title={'get color mode'}
        onPress={() => {
          getFromLocalStorage({key: 'colorMode'});
        }}
      />

      <Button
        title={message}
        onPress={() => {
          navigation.navigate(PlayerProfilePage);
        }}
      />
    </View>
  );
};

export default PlayerHome;

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
