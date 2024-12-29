import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const PlayIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 25}
    height={props.height ?? 25}
    fill={props.color ?? 'none'}
    viewBox='0 0 25 25'
    {...props}>
    <Path
      stroke={props.stroke ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={props.strokeWidth ?? 1.5}
      d='M7.98 3.51c-2.55.88-3 5.59-3 8.9 0 3.31.43 8 3 8.91 2.71.93 11-5.16 11-8.91s-8.29-9.83-11-8.9Z'
    />
  </Svg>
);
