import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const MilestoneIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox='0 0 24 24'
    fill='none'
    {...props}>
    <Path
      fill={props.color ?? '#000'}
      d='m15.2 7.16-8-3.46v-.95c0-.41-.34-.75-.75-.75s-.75.34-.75.75v18.5c0 .41.34.75.75.75s.75-.34.75-.75v-3.96l8.22-4.06h.01c1.66-.86 2.55-1.97 2.5-3.14-.05-1.17-1.02-2.21-2.73-2.93Z'
    />
  </Svg>
);
