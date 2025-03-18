import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const CircularCrossIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 20}
    height={props.height ?? 20}
    viewBox='0 0 20 20'
    fill='none'
    {...props}>
    <Path
      fill={props.color ?? '#000'}
      d='M10 0C4.49 0 0 4.49 0 10s4.49 10 10 10 10-4.49 10-10S15.51 0 10 0Zm3.36 12.3c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-2.3-2.3-2.3 2.3c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l2.3-2.3-2.3-2.3a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 2.3-2.3c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.3 2.3 2.3 2.3Z'
    />
  </Svg>
);
