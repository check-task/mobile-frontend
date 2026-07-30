import { Circle } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Drag(props: IconProps) {
  return (
    <IconBase {...props}>
      <Circle cx={5} cy={3} r={1} fill="currentColor" />
      <Circle cx={9} cy={3} r={1} fill="currentColor" />
      <Circle cx={5} cy={7} r={1} fill="currentColor" />
      <Circle cx={9} cy={7} r={1} fill="currentColor" />
      <Circle cx={5} cy={11} r={1} fill="currentColor" />
      <Circle cx={9} cy={11} r={1} fill="currentColor" />
    </IconBase>
  );
}
