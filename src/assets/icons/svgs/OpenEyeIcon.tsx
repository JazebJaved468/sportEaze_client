import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const OpenEyeIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 22}
    height={props.height ?? 14}
    viewBox='0 0 22 14'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#fff'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M2.587 8.779c1.78 1.769 4.883 4.22 8.413 4.22 3.53 0 6.634-2.451 8.413-4.22.47-.467.705-.7.854-1.159.107-.327.107-.913 0-1.24-.15-.458-.385-.692-.854-1.159C17.633 3.452 14.531 1 11 1 7.47 1 4.366 3.452 2.587 5.221c-.47.467-.705.7-.854 1.159-.107.327-.107.913 0 1.24.15.458.384.692.854 1.159Z'
    />
    <Path
      stroke={props.color ?? '#fff'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M9 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z'
    />
  </Svg>
);
