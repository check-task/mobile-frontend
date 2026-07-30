import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Swap(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path d="M4 10H20" stroke="currentColor" strokeLinecap="round" />
      <Path d="M20 14H4" stroke="currentColor" strokeLinecap="round" />
      <Path d="M8 6L4 10" stroke="currentColor" strokeLinecap="round" />
      <Path d="M16 18L20 14" stroke="currentColor" strokeLinecap="round" />
    </IconBase>
  );
}
