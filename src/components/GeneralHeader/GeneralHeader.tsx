import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Container} from 'native-base';

export const GeneralHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Sport Eaze</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  textStyle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
