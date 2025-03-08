import * as React from 'react';
import Svg, {SvgProps, Circle, Ellipse} from 'react-native-svg';
export const UserPlaceholderIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill='none' viewBox='0 0 24 24' {...props}>
    <Circle
      cx={12}
      cy={6}
      r={4}
      stroke={props.color ?? '#ffffff'}
      strokeWidth={1.2}
    />
    <Ellipse
      cx={12}
      cy={17}
      stroke={props.color ?? '#ffffff'}
      strokeWidth={1.2}
      rx={7}
      ry={4}
    />
  </Svg>
);
