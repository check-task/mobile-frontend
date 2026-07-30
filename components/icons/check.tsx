import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Check(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M6 12L9.50077 17.2512C9.73826 17.6074 10.2617 17.6074 10.4992 17.2512L18 6"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </IconBase>
  );
}
