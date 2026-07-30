import { Path, Rect } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function CheckBox(props: IconProps) {
  return (
    <IconBase {...props}>
      <Rect x={4} y={4} width={16} height={16} rx={1} stroke="currentColor" />
      <Path
        d="M8 12L10.2506 15.376C10.4486 15.6728 10.8848 15.6728 11.0827 15.376L16 8"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
