import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Top(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M18 14L12.7071 8.70711C12.3166 8.31658 11.6834 8.31658 11.2929 8.70711L6 14"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
