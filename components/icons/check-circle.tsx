import { Circle, Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function CheckCircle(props: IconProps) {
  return (
    <IconBase {...props}>
      <Circle cx={12} cy={12} r={8.5} stroke="currentColor" />
      <Path
        d="M8 12L10.2506 15.376C10.4486 15.6728 10.8848 15.6728 11.0827 15.376L16 8"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
