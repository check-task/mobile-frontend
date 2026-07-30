import { Circle, Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Eye(props: IconProps) {
  return (
    <IconBase {...props}>
      <Circle cx={12} cy={12} r={3} stroke="currentColor" />
      <Path
        d="M21 12.1737C21 15.3953 15.7279 17 12 17C8.27202 17 3 15.3953 3 12.1737C3 8.95201 8.27202 7 12 7C15.7279 7 21 8.95201 21 12.1737Z"
        stroke="currentColor"
      />
    </IconBase>
  );
}
