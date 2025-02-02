import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const TickIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 15}
    height={props.height ?? 12}
    viewBox='0 0 15 12'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#fff'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={3}
      d='m1 6 4.243 4.243 8.484-8.486'
    />
  </Svg>
);
