import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const LogoutIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 18}
    height={props.height ?? 18}
    viewBox='0 0 18 18'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#fff'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='m9 12 3-3m0 0L9 6m3 3H1m5-4.751V4.2c0-1.12 0-1.68.218-2.108.192-.377.497-.682.874-.874C7.52 1 8.08 1 9.2 1h4.6c1.12 0 1.68 0 2.107.218.377.192.683.497.875.874.218.427.218.987.218 2.105v9.607c0 1.117 0 1.676-.218 2.104a2.002 2.002 0 0 1-.875.874c-.427.218-.986.218-2.104.218H9.197c-1.118 0-1.678 0-2.105-.218a2 2 0 0 1-.874-.874C6 15.48 6 14.92 6 13.8v-.05'
    />
  </Svg>
);
