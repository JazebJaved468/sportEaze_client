import * as React from "react"
import Svg, { SvgProps, Path, Rect } from "react-native-svg"
export const EmailIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m4 7 6.2 4.65a3 3 0 0 0 3.6 0L20 7"
    />
    <Rect
      width={18}
      height={14}
      x={3}
      y={5}
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={2}
      rx={2}
    />
  </Svg>
)

