import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const CustomerSupportIcon = (props: SvgProps) => (
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
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d='M20 12.2v1.7c0 3.15-1.8 4.5-4.5 4.5h-9c-2.7 0-4.5-1.35-4.5-4.5V8.5C2 5.35 3.8 4 6.5 4h2.7c-.13.38-.2.8-.2 1.25v3.9c0 .97.32 1.79.89 2.36.57.57 1.39.89 2.36.89v1.39c0 .51.58.82 1.01.54l2.89-1.93h2.6c.45 0 .87-.07 1.25-.2Z'
    />
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d='M22 5.25v3.9c0 1.49-.76 2.61-2 3.05-.38.13-.8.2-1.25.2h-2.6l-2.89 1.93c-.43.28-1.01-.03-1.01-.54V12.4c-.97 0-1.79-.32-2.36-.89-.57-.57-.89-1.39-.89-2.36v-3.9c0-.45.07-.87.2-1.25.44-1.24 1.56-2 3.05-2h6.5C20.7 2 22 3.3 22 5.25ZM7.4 22h7.2M11 18.4V22'
    />
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M18.495 7.25h.01M15.696 7.25h.009M12.895 7.25h.01'
    />
  </Svg>
);
