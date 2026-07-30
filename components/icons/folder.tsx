import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Folder(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M3 8V6C3 5.44772 3.44772 5 4 5H10.4648C10.7992 5 11.1114 5.1671 11.2969 5.4453L12.7031 7.5547C12.8886 7.8329 13.2008 8 13.5352 8H20C20.5523 8 21 8.44772 21 9V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18V8Z"
        stroke="currentColor"
      />
    </IconBase>
  );
}
