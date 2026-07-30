import { Circle } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Menu(props: IconProps) {
  return (
    <IconBase {...props}>
      <Circle cx={12} cy={12} r={1} fill="currentColor" />
      <Circle cx={12} cy={8} r={1} fill="currentColor" />
      <Circle cx={12} cy={16} r={1} fill="currentColor" />
    </IconBase>
  );
}
