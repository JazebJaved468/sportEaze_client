import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const RemoveUserIcon = (props: SvgProps) => (
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
      d='M19.5 19h-4M12.15 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C7.55 3.99 9.53 2 11.99 2a4.435 4.435 0 0 1 .16 8.87ZM11.99 21.81c-1.82 0-3.63-.46-5.01-1.38-2.42-1.62-2.42-4.26 0-5.87 2.75-1.84 7.26-1.84 10.01 0'
    />
  </Svg>
);
