import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Add(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path d="M4 12H20" stroke="currentColor" strokeLinecap="round" />
      <Path d="M12 4V20" stroke="currentColor" strokeLinecap="round" />
    </IconBase>
  );
}
