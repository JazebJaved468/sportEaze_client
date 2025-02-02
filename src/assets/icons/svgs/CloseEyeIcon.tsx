import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const CloseEyeIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 22}
    height={props.height ?? 18}
    viewBox='0 0 22 18'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#fff'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='m3 1 16 16m-3.5-3.244C14.147 14.485 12.618 15 11 15c-3.53 0-6.634-2.452-8.413-4.221-.47-.467-.705-.7-.854-1.159-.107-.327-.107-.913 0-1.24.15-.459.385-.693.855-1.16.897-.892 2.13-1.956 3.584-2.793M18.5 11.634c.333-.293.638-.582.912-.854l.003-.003c.468-.466.703-.7.852-1.156.107-.327.107-.914 0-1.241-.15-.458-.384-.692-.854-1.159C17.633 5.452 14.53 3 11 3c-.338 0-.671.022-1 .064m2.323 7.436A2 2 0 0 1 9.56 7.611'
    />
  </Svg>
);
