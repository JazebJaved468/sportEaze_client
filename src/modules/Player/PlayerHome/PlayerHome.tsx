import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {PlayerProfilePage} from '../PlayerProfile';

const PlayerHome = () => {
  const navigation = useAppNavigation();
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <Text style={styles.homeText}>Home</Text>
      </View>

      <Button
        title={'Go To Profile'}
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
