import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const FemaleIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox='0 0 24 24'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#292D32'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M5 9c0 3.87 3.13 7 7 7s7-3.13 7-7-3.13-7-7-7c-1.93 0-3.68.78-4.95 2.05M12 16v6M15 19H9'
    />
  </Svg>
);
