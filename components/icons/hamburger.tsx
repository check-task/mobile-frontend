import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Hamburger(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path d="M4 12H20" stroke="currentColor" strokeLinecap="round" />
      <Path d="M4 8H20" stroke="currentColor" strokeLinecap="round" />
      <Path d="M20 16H4" stroke="currentColor" strokeLinecap="round" />
    </IconBase>
  );
}
