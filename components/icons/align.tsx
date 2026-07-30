import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Align(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M8 9L11.1515 5.84853C11.6201 5.3799 12.3799 5.3799 12.8485 5.84853L16 9"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path
        d="M8 15L11.1515 18.1515C11.6201 18.6201 12.3799 18.6201 12.8485 18.1515L16 15"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path d="M14 12L10 12" stroke="currentColor" strokeLinecap="round" />
    </IconBase>
  );
}
