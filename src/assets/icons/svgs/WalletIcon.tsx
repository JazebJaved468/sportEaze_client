import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const WalletIcon = (props: SvgProps) => (
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
      d='M10.752 16.86v2.03c0 1.72-1.6 3.11-3.57 3.11-1.97 0-3.58-1.39-3.58-3.11v-2.03c0 1.72 1.6 2.94 3.58 2.94 1.97 0 3.57-1.23 3.57-2.94Z'
    />
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={props.strokeWidth ?? 1.5}
      d='M10.75 14.11c0 .5-.14.96-.38 1.36-.59.97-1.8 1.58-3.2 1.58-1.4 0-2.61-.62-3.2-1.58-.24-.4-.38-.86-.38-1.36 0-.86.4-1.63 1.04-2.19.65-.57 1.54-.91 2.53-.91.99 0 1.88.35 2.53.91.66.55 1.06 1.33 1.06 2.19Z'
    />
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={props.strokeWidth ?? 1.5}
      d='M10.752 14.11v2.75c0 1.72-1.6 2.94-3.57 2.94-1.97 0-3.58-1.23-3.58-2.94v-2.75c0-1.72 1.6-3.11 3.58-3.11.99 0 1.88.35 2.53.91.64.56 1.04 1.34 1.04 2.2ZM22 10.97v2.06c0 .55-.44 1-1 1.02h-1.96c-1.08 0-2.07-.79-2.16-1.87-.06-.63.18-1.22.6-1.63.37-.38.88-.6 1.44-.6H21c.56.02 1 .47 1 1.02Z'
    />
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={props.strokeWidth ?? 1.5}
      d='M2 10.5v-2c0-2.72 1.64-4.62 4.19-4.94.26-.04.53-.06.81-.06h9c.26 0 .51.01.75.05C19.33 3.85 21 5.76 21 8.5v1.45h-2.08c-.56 0-1.07.22-1.44.6-.42.41-.66 1-.6 1.63.09 1.08 1.08 1.87 2.16 1.87H21v1.45c0 3-2 5-5 5h-2.5'
    />
  </Svg>
);
