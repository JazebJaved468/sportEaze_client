import {Button, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../utils/customHooks/storeHooks';
import {set} from 'date-fns';
import {updateMessage} from '../../../store/sample/sample.slice';
import {useGetSampleColorsQuery} from '../../../store/sample/sample.service';
import {Text, useColorMode, useColorModeValue, View} from 'native-base';
import {
  getFromLocalStorage,
  storeInLocalStorage,
} from '../../../utils/helpers/asyncStorage';
const PlayerHome = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const {message} = useAppSelector(state => state.sample);

  const {data, isLoading} = useGetSampleColorsQuery();

  console.log('Sample data from api', data);

  const backgroundColor = useColorModeValue('white', 'black');
  const textColor = useColorModeValue('black', 'white');

  return (
    <View style={{flex: 1, backgroundColor: backgroundColor}}>
      <View style={styles.container}>
        <Text style={[styles.homeText, {color: textColor}]}>Sample Home</Text>
        {/* <Button
          onPress={() => {
            dispatch(updateMessage('Go to Player profile'));
          }}>
          Update Message
        </Button> */}
      </View>

      <View style={{height: 100}}>
        <Button
          title={message}
          onPress={() => {
            // navigation.navigate(PlayerProfilePage);
          }}>
          {/* {message} */}
        </Button>
      </View>
    </View>
  );
};

export default PlayerHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeText: {
    fontSize: 30,
    lineHeight: 50,
    fontWeight: '700',
  },
});
