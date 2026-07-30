import { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function CheckCircleFill(props: IconProps) {
  return (
    <IconBase {...props}>
      <Defs>
        <ClipPath id="clip">
          <Rect width={24} height={24} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip)">
        <Circle cx={12} cy={12} r={12} fill="currentColor" />
        <Path
          d="M6.667 12L9.667 16.501C9.931 16.897 10.513 16.897 10.777 16.501L17.333 6.667"
          stroke="white"
          strokeWidth={1.333}
          strokeLinecap="round"
        />
      </G>
    </IconBase>
  );
}
