import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const NotificationsIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox='0 0 24 24'
    fill={props.fill ?? 'none'}
    {...props}>
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d='M12.02 2C8.34 2 5.36 4.98 5.36 8.66v2.1c0 .68-.28 1.7-.63 2.28l-1.27 2.12c-.78 1.31-.24 2.77 1.2 3.25a23.34 23.34 0 0 0 14.73 0 2.22 2.22 0 0 0 1.2-3.25l-1.27-2.12c-.35-.58-.63-1.61-.63-2.28v-2.1C18.68 5 15.68 2 12.02 2Z'
    />
    <Path
      stroke={props.color ?? '#000'}
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d='M15.33 18.82c0 1.83-1.5 3.33-3.33 3.33-.91 0-1.75-.38-2.35-.98-.6-.6-.98-1.44-.98-2.35'
    />
  </Svg>
);
