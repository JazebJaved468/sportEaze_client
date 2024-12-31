import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import {appColors} from '../../../constants/colors';
export const ScarIcon = (props: SvgProps) => (
  <Svg width={229} height={531} fill='none' {...props}>
    <Path
      fill={appColors.warmRed}
      d='m206.675 168.968 104.053 10.979-94.926-31.106L25.952.631l180.723 168.337Z'
    />
    <Path
      fill={appColors.warmRed}
      d='M170.165 229.35 97.146 103.097l91.274 93.317 293.903 27.446-312.158 5.49ZM249.79 319.257l-61.911 84.54 74.653-66.493 223.404-89.636-236.146 71.589Z'
    />
    <Path
      fill={appColors.warmRed}
      d='m216.167 257.214 145.593.432-126.416 31.973L63.541 530.204l152.626-272.99ZM98.031 278.569l-45.198-94.581 23.313 97.336-26.45 239.739 48.335-242.494Z'
    />
    <Path
      fill={appColors.warmRed}
      d='M168.47 278.096 99.456 406.591l31.463-126.82L.227 14.487 168.47 278.096Z'
    />
  </Svg>
);
