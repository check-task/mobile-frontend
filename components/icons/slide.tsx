import { Path, Rect } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Slide(props: IconProps) {
  return (
    <IconBase {...props}>
      <Rect x={3} y={5} width={18} height={14} rx={1} stroke="currentColor" />
      <Path d="M9 5V19" stroke="currentColor" strokeLinecap="round" />
    </IconBase>
  );
}
