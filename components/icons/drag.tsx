import { Circle } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Drag(props: IconProps) {
  return (
    <IconBase {...props}>
      <Circle cx={8.571} cy={5.143} r={1.714} fill="currentColor" />
      <Circle cx={15.429} cy={5.143} r={1.714} fill="currentColor" />
      <Circle cx={8.571} cy={12} r={1.714} fill="currentColor" />
      <Circle cx={15.429} cy={12} r={1.714} fill="currentColor" />
      <Circle cx={8.571} cy={18.857} r={1.714} fill="currentColor" />
      <Circle cx={15.429} cy={18.857} r={1.714} fill="currentColor" />
    </IconBase>
  );
}
