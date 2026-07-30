import { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function CancelFill(props: IconProps) {
  return (
    <IconBase {...props}>
      <Defs>
        <ClipPath id="clip">
          <Rect width={24} height={24} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip)">
        <Circle cx={12} cy={12} r={12} fill="currentColor" />
        <Path d="M17 7L7 17" stroke="white" strokeLinecap="round" />
        <Path d="M7 7L17 17" stroke="white" strokeLinecap="round" />
      </G>
    </IconBase>
  );
}
