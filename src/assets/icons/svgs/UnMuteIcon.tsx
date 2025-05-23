import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const UnMuteIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 16}
    height={props.height ?? 16}
    fill={'none'}
    viewBox='0 0 24 24'
    {...props}>
    <Path
      stroke={props.stroke ?? '#222'}
      d='M3.158 13.93a3.752 3.752 0 0 1 0-3.86 1.5 1.5 0 0 1 .993-.7l1.693-.339a.45.45 0 0 0 .258-.153L8.17 6.395c1.182-1.42 1.774-2.129 2.301-1.938C11 4.648 11 5.572 11 7.42v9.162c0 1.847 0 2.77-.528 2.962-.527.19-1.119-.519-2.301-1.938L6.1 15.122a.45.45 0 0 0-.257-.153l-1.693-.339a1.5 1.5 0 0 1-.993-.7Z'
    />
    <Path
      stroke={props.stroke ?? '#222'}
      strokeLinecap='round'
      d='M15.536 8.464a5 5 0 0 1 .027 7.044M19.657 6.343a8 8 0 0 1 .044 11.27'
    />
  </Svg>
);
