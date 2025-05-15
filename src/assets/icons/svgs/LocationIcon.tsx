import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { appColors } from "../../../constants/colors"
export const LocationIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 384 512"
    width={15}
    height={15}
    {...props}
  >
    <Path  fill={appColors.lightGrey} d="M215.7 499.2C267 435 384 279.4 384 192 384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2 12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
  </Svg>
)



