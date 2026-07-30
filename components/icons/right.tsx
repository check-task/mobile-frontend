import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Right(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M10 6L15.2929 11.2929C15.6834 11.6834 15.6834 12.3166 15.2929 12.7071L10 18"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
