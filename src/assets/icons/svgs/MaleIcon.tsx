import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const MaleIcon = (props: SvgProps) => (
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
      d='M4.27 18.68a7.75 7.75 0 1 0-1.77-4.93M21.5 2.5 16 8M15 2.5h6.5V9'
    />
  </Svg>
);
