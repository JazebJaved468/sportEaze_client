import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const ArrowRightIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 9}
    height={props.height ?? 18}
    viewBox='0 0 9 18'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeMiterlimit={10}
      strokeWidth={props.strokeWidth ?? 1.5}
      d='m.91 16.92 6.52-6.52c.77-.77.77-2.03 0-2.8L.91 1.08'
    />
  </Svg>
);
