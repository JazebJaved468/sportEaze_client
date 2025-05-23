import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const ExploreIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox='0 0 24 24'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M14 5h6M14 8h3M21 11.5c0 5.25-4.25 9.5-9.5 9.5S2 16.75 2 11.5 6.25 2 11.5 2M22 22l-2-2'
    />
  </Svg>
);
