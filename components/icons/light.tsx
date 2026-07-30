import { Circle, Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Light(props: IconProps) {
  return (
    <IconBase {...props}>
      <Circle cx={12} cy={12} r={5.5} stroke="currentColor" />
      <Path d="M12 3V5" stroke="currentColor" strokeLinecap="round" />
      <Path d="M12 19V21" stroke="currentColor" strokeLinecap="round" />
      <Path d="M3 12H5" stroke="currentColor" strokeLinecap="round" />
      <Path d="M19 12H21" stroke="currentColor" strokeLinecap="round" />
      <Path
        d="M5.6377 5.63959L7.05191 7.0538"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path
        d="M16.9512 16.9533L18.3654 18.3675"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path
        d="M18.3652 5.63867L16.951 7.05289"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path
        d="M7.05078 16.9531L5.63657 18.3673"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
