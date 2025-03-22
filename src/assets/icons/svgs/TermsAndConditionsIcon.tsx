import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const TermsAndConditionsIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox='0 0 24 24'
    fill={props.fill ?? 'none'}
    {...props}>
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M4.13 13h12.522M4.13 17h12.522M11.435 8h5.217'
    />
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M5.174 8h.007M8.304 8h.008'
    />
    <Path
      stroke={props.color ?? '#000'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M6 1h9c.62 0 1.17.028 1.66.124C19.29 1.522 20 3.227 20 7.875v8.25c0 4.648-.71 6.352-3.34 6.751-.49.096-1.04.124-1.66.124H6c-.62 0-1.17-.027-1.66-.124C1.71 22.477 1 20.772 1 16.125v-8.25c0-4.647.71-6.353 3.34-6.751C4.83 1.027 5.38 1 6 1Z'
    />
  </Svg>
);
