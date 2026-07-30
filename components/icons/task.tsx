import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Task(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M14.625 3L19 8.5V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V4C5 3.44772 5.44772 3 6 3H14.625ZM19 8.5H15.625C15.0727 8.5 14.625 8.05228 14.625 7.5V3M8 14H12M8 11H14M8 17H15"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
