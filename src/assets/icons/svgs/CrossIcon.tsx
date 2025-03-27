import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const CrossIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 16}
    height={props.height ?? 16}
    viewBox='0 0 16 16'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#292D32'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={props.strokeWidth ?? 1.5}
      d='M1.001 1 15 15M1 15 14.999 1'
    />
  </Svg>
);
