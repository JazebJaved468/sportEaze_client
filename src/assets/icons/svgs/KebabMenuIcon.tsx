import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const KebabMenuIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox='0 0 24 24'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeWidth={1.8}
      d='M3 7h18M3 12h18M3 17h18'
    />
  </Svg>
);
