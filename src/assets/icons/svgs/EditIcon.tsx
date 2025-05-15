import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
export const EditIcon = (props: SvgProps) => (
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
      d="M4 16v4h4L18.869 9.131h0c.396-.396.594-.594.668-.822a1 1 0 0 0 0-.618c-.074-.228-.272-.426-.668-.822l-1.74-1.74c-.395-.394-.592-.592-.82-.666a1 1 0 0 0-.618 0c-.228.074-.426.272-.82.667l-.002.001L4 16.001Z"
    />
  </Svg>
);
