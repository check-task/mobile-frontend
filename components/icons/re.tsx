import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Re(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M4 11H16.2285C17.1647 11 18.0473 11.4371 18.6148 12.1819C19.433 13.2559 19.433 14.7441 18.6148 15.8181C18.0473 16.5629 17.1647 17 16.2285 17H14.2857"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path d="M8 7L4 11L8 15" stroke="currentColor" strokeLinecap="round" />
    </IconBase>
  );
}
