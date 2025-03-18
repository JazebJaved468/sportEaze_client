import * as React from 'react';
import Svg, {SvgProps, Defs, ClipPath, Path, G} from 'react-native-svg';
export const SparkleStarsIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 151}
    height={props.height ?? 148}
    viewBox='0 0 151 148'
    fill='none'
    {...props}>
    <Path
      fill={props.color ?? '#fff'}
      d='m75.982 0 1.268 34.22c.776 20.937 17.575 37.728 38.512 38.493L150.982 74l-35.22 1.287c-20.937.765-37.736 17.556-38.512 38.492L75.982 148l-1.269-34.221c-.775-20.936-17.574-37.727-38.511-38.492L.982 74l35.22-1.287c20.936-.765 37.736-17.556 38.511-38.492L75.982 0Z'
    />
  </Svg>
);
