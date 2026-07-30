import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Cancel(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path d="M18 6L6 18" stroke="currentColor" strokeLinecap="round" />
      <Path d="M6 6L18 18" stroke="currentColor" strokeLinecap="round" />
    </IconBase>
  );
}
