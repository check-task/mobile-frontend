import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Bottom(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M18 10L12.7071 15.2929C12.3166 15.6834 11.6834 15.6834 11.2929 15.2929L6 10"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
