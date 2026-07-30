import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function B(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M4 12L11.4 17.55C11.7556 17.8167 12.2444 17.8167 12.6 17.55L20 12"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path
        d="M4 6L11.4 11.55C11.7556 11.8167 12.2444 11.8167 12.6 11.55L20 6"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
