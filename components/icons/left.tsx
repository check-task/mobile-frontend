import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Left(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M14 6L8.70711 11.2929C8.31658 11.6834 8.31658 12.3166 8.70711 12.7071L14 18"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
