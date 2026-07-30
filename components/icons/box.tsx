import { Rect } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Box(props: IconProps) {
  return (
    <IconBase {...props}>
      <Rect x={4} y={4} width={16} height={16} rx={1} stroke="currentColor" />
    </IconBase>
  );
}
