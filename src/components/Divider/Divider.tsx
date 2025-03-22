import {StyleSheet, Text, View} from 'react-native';

import React from 'react';
import {useDividerColor} from '../../utils/customHooks/colorHooks';
import {Divider as NativeBaseDivider} from 'native-base';

const Divider = () => {
  const dividerColor = useDividerColor();
  return <NativeBaseDivider thickness={0.8} />;
};

export default Divider;

const styles = StyleSheet.create({});
