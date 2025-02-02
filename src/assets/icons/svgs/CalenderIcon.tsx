import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const CalenderIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 18}
    height={props.height ?? 20}
    viewBox='0 0 18 20'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#fff'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5 3h-.8c-1.12 0-1.68 0-2.108.218a1.999 1.999 0 0 0-.874.874C1 4.52 1 5.08 1 6.2V7m4-4h8M5 3V1m8 2h.8c1.12 0 1.68 0 2.107.218.377.192.683.497.875.874.218.427.218.987.218 2.105V7m-4-4V1M1 7v8.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h9.606c1.118 0 1.677 0 2.104-.218.377-.192.683-.498.875-.874.218-.428.218-.986.218-2.104V7M1 7h16m-4 8h.002v.002H13V15Zm-4 0h.002v.002H9V15Zm-4 0h.002v.002H5V15Zm8.002-4v.002H13V11h.002ZM9 11h.002v.002H9V11Zm-4 0h.002v.002H5V11Z'
    />
  </Svg>
);
