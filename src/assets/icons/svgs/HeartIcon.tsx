import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const HeartIcon = (props: SvgProps) => (
  <Svg width={26} height={26} viewBox='0 -3.71 75.17 75.17' {...props}>
    <Path
      fill='none'
      stroke={props.color ?? '#000'}
      strokeLinejoin='round'
      strokeWidth={4}
      d='M37.585 66.244s22.263-15.459 31.959-30.318c9.6-14.708.354-31.054-10.533-33.8-14.457-3.65-21.426 10.478-21.426 10.478S30.617-1.524 16.16 2.126C5.272 4.874-3.972 21.22 5.626 35.926c9.696 14.859 31.959 30.318 31.959 30.318Z'
      data-name='Path 1'
    />
  </Svg>
);
