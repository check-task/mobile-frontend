import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Logout(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M11 5H4C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19H11"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path d="M10 12L20 12" stroke="currentColor" strokeLinecap="round" />
      <Path
        d="M17 8L20.2929 11.2929C20.6834 11.6834 20.6834 12.3166 20.2929 12.7071L17 16"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
