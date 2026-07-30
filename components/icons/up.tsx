import { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Up(props: IconProps) {
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
          d="M7 11L11.0781 6.10624C11.5579 5.53053 12.4421 5.53053 12.9219 6.10624L17 11"
          stroke="white"
          strokeLinecap="round"
        />
        <Path d="M12 6L12 19" stroke="white" strokeLinecap="round" />
      </G>
    </IconBase>
  );
}
