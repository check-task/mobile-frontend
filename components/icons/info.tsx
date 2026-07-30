import { Circle, Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Info(props: IconProps) {
  return (
    <IconBase {...props}>
      <Circle cx={12} cy={12} r={8.5} stroke="currentColor" />
      <Circle cx={12} cy={7} r={1} fill="currentColor" />
      <Path d="M12 10V18" stroke="currentColor" strokeLinecap="round" />
    </IconBase>
  );
}
