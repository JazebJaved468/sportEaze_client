import {StyleSheet, Text, View} from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import React, {ReactElement, ReactNode} from 'react';
import {appColors} from '../../constants/colors';
import {useColorMode, useColorModeValue} from 'native-base';

type SkeletonLoaderProps = {
  children: ReactElement;
};

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({children}) => {
  const skeletonBackground = useColorModeValue('#f0f0f0', '#3a3a3a');
  const skeletonAnimation = useColorModeValue('#e0e0e0', '#4a4a4a');

  return (
    <SkeletonPlaceholder
      backgroundColor={skeletonBackground}
      highlightColor={skeletonAnimation}
      speed={1200}
      direction='right'>
      {children}
    </SkeletonPlaceholder>
  );
};
