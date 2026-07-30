import { Path, Rect } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Filter(props: IconProps) {
  return (
    <IconBase {...props}>
      <Rect width={24} height={24} rx={12} fill="currentColor" />
      <Path d="M16 12L8 12" stroke="white" strokeLinecap="round" />
      <Path d="M18 9L6 9" stroke="white" strokeLinecap="round" />
      <Path d="M14 15L10 15" stroke="white" strokeLinecap="round" />
    </IconBase>
  );
}
