import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const ShareIcon = (props: SvgProps) => (
  <Svg width={26} height={26} fill='none' viewBox='-0.5 0 25 25' {...props}>
    <Path
      stroke='#000'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.4}
      d='M13.47 4.14c-.73.22-1.19 1.82-1.38 3.77C6.78 7.91 2 13.48 2 20.08c2.19-6 7-7.63 10.14-7.63.2 1.76.65 3.17 1.33 3.37 2.1.61 8.53-3.38 8.53-5.84s-6.43-6.45-8.53-5.84Z'
    />
  </Svg>
);
