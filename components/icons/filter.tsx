import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Filter(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path d="M16 12L8 12" stroke="currentColor" strokeLinecap="round" />
      <Path d="M18 9L6 9" stroke="currentColor" strokeLinecap="round" />
      <Path d="M14 15L10 15" stroke="currentColor" strokeLinecap="round" />
    </IconBase>
  );
}
