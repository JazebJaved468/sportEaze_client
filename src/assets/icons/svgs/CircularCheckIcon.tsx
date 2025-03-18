import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const CircularCheckIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 20}
    height={props.height ?? 20}
    viewBox='0 0 20 20'
    fill='none'
    {...props}>
    <Path
      fill={props.color ?? '#000'}
      d='M10 0C4.49 0 0 4.49 0 10s4.49 10 10 10 10-4.49 10-10S15.51 0 10 0Zm4.78 7.7-5.67 5.67a.75.75 0 0 1-1.06 0l-2.83-2.83a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 5.14-5.14c.29-.29.77-.29 1.06 0 .29.29.29.76 0 1.06Z'
    />
  </Svg>
);
