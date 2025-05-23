import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const CameraIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 20}
    height={props.height ?? 17}
    viewBox='0 0 20 17'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#fff'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.4}
      d='M7.489 4H4.2c-1.12 0-1.68 0-2.108.218a1.999 1.999 0 0 0-.874.874C1 5.52 1 6.08 1 7.2v5.6c0 1.12 0 1.68.218 2.107.192.377.497.684.874.875.427.218.987.218 2.105.218h11.606c1.118 0 1.677 0 2.104-.218.377-.191.683-.498.875-.875.218-.427.218-.986.218-2.104V7.197c0-1.118 0-1.678-.218-2.105a2.001 2.001 0 0 0-.875-.874C17.48 4 16.92 4 15.8 4h-3.29M7.49 4h.062m-.062 0h.062m-.062 0c-.106 0-.166 0-.213-.006a1.001 1.001 0 0 1-.867-1.203c.012-.054.034-.122.08-.257l.001-.006c.052-.154.077-.23.106-.299a2 2 0 0 1 1.699-1.224C8.368 1 8.449 1 8.61 1h2.778c.162 0 .243 0 .317.005a2 2 0 0 1 1.698 1.224c.029.068.054.145.106.3.046.138.07.207.08.262a1 1 0 0 1-.866 1.203 2.125 2.125 0 0 1-.213.006M7.55 4h4.898m0 0h.062m-.062 0h.062M10 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z'
    />
  </Svg>
);
