import { Circle, Path, Rect } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Calendar(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path d="M20 10H4" stroke="currentColor" strokeLinecap="round" />
      <Rect
        x={20}
        y={6}
        width={14}
        height={16}
        rx={1}
        transform="rotate(90 20 6)"
        stroke="currentColor"
      />
      <Circle cx={8} cy={13} r={1} fill="currentColor" />
      <Circle cx={12} cy={13} r={1} fill="currentColor" />
      <Circle cx={16} cy={13} r={1} fill="currentColor" />
      <Circle cx={8} cy={17} r={1} fill="currentColor" />
      <Circle cx={12} cy={17} r={1} fill="currentColor" />
      <Circle cx={16} cy={17} r={1} fill="currentColor" />
      <Path d="M8 4V6" stroke="currentColor" strokeLinecap="round" />
      <Path d="M16 4V6" stroke="currentColor" strokeLinecap="round" />
    </IconBase>
  );
}
