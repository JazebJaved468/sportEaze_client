import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const ComparisonIcon = (props: SvgProps) => (
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
      strokeWidth={props.strokeWidth ?? 1.5}
      d='M16.96 6.17c2 1.39 3.38 3.6 3.66 6.15M3.49 12.37a8.601 8.601 0 0 1 3.6-6.15M8.19 20.94c1.16.59 2.48.92 3.87.92 1.34 0 2.6-.3 3.73-.85M12.06 7.7a2.78 2.78 0 1 0 0-5.56 2.78 2.78 0 0 0 0 5.56ZM4.83 19.92a2.78 2.78 0 1 0 0-5.56 2.78 2.78 0 0 0 0 5.56ZM19.17 19.92a2.78 2.78 0 1 0 0-5.56 2.78 2.78 0 0 0 0 5.56Z'
    />
  </Svg>
);
