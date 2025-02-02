import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const AthleteIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 44}
    height={props.height ?? 44}
    viewBox='0 0 44 44'
    fill='none'
    {...props}>
    <Path
      stroke={props.color ?? '#434492'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d='m29.49 15.748 7.01 3.27a2.578 2.578 0 0 0 3.426-1.248l2.543-5.452a2.578 2.578 0 0 0-4.673-2.18l-1.453 3.116-8.178-3.813'
    />
    <Path
      stroke={props.color ?? '#434492'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d='M28.165 9.44a4.727 4.727 0 0 0-6.281 2.287l-2.567 5.503a7.734 7.734 0 0 0 .997 8.133l6.586 8.142-2.542 5.452a2.578 2.578 0 1 0 4.673 2.179l3.223-6.911a2.578 2.578 0 0 0-.333-2.711l-6.205-7.671 3.775-8.095'
    />
    <Path
      stroke={props.color ?? '#434492'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d='M30.05 1.375a4.297 4.297 0 1 0 0 8.594 4.297 4.297 0 0 0 0-8.594ZM1.29 22.86h10.312M1.29 28.016h5.155M18.595 20.39l-.76 8.82-5.653 2.058a2.578 2.578 0 1 0 1.764 4.845l7.166-2.608a2.578 2.578 0 0 0 1.682-2.152l.273-2.586M25.714 9.024l-7.987-1.987a2.578 2.578 0 0 0-2.597.845l-4.902 5.841a2.578 2.578 0 0 0 3.95 3.315l3.867-4.608 3.146.783'
    />
  </Svg>
);
