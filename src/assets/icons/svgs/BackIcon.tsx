import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const BackIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 9}
    height={props.height ?? 16}
    viewBox='0 0 9 16'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M8 15 1 8l7-7'
    />
  </Svg>
);
