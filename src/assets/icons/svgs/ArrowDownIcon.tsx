import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const ArrowDownIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 18}
    height={props.height ?? 9}
    viewBox='0 0 18 9'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeMiterlimit={10}
      strokeWidth={props.strokeWidth ?? 1.5}
      d='M16.92.95 10.4 7.47c-.77.77-2.03.77-2.8 0L1.08.95'
    />
  </Svg>
);
