import { Circle, Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Share(props: IconProps) {
  return (
    <IconBase {...props}>
      <Circle cx={18} cy={6} r={2} stroke="currentColor" />
      <Circle cx={18} cy={18} r={2} stroke="currentColor" />
      <Circle cx={6} cy={12} r={2} stroke="currentColor" />
      <Path d="M8 11L16 7" stroke="currentColor" />
      <Path d="M8 13L16 17" stroke="currentColor" />
    </IconBase>
  );
}
