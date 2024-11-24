import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const BackIcon = (props: SvgProps) => (
  <Svg width={14} height={22} fill='none' {...props}>
    <Path
      fill={props.color ?? '#2E3A59'}
      d='M.813 11 10.83 21.017l2.357-2.357-7.667-7.667 7.667-7.666L10.83.983.813 11Z'
    />
  </Svg>
);
