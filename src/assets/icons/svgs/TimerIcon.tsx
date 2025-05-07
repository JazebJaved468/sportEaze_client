import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const TimerIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox='0 0 24 24'
    fill='none'
    {...props}>
    <Path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M15.24 2H8.76C5 2 4.71 5.38 6.74 7.22l10.52 9.56C19.29 18.62 19 22 15.24 22H8.76C5 22 4.71 18.62 6.74 16.78l10.52-9.56C19.29 5.38 19 2 15.24 2Z'
    />
  </Svg>
);
