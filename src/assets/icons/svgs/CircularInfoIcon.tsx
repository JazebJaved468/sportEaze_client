import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const CircularInfoIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox='0 0 24 24'
    fill='none'
    style={{transform: [{rotate: '180deg'}]}}
    {...props}>
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM12 8v5'
    />
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M11.995 16h.009'
    />
  </Svg>
);
