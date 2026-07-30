import { Circle, Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Clock(props: IconProps) {
  return (
    <IconBase {...props}>
      <Circle cx={12} cy={13} r={7} stroke="currentColor" />
      <Path d="M7 4L4 7" stroke="currentColor" strokeLinecap="round" />
      <Path d="M17 4L20 7" stroke="currentColor" strokeLinecap="round" />
      <Path d="M12 8V13L15 17" stroke="currentColor" strokeLinecap="round" />
    </IconBase>
  );
}
