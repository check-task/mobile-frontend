import { Circle, Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Camera(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M6.67479 7.80855L8.45021 5.40573C8.63875 5.15056 8.9372 5 9.25448 5H14.7455C15.0628 5 15.3612 5.15056 15.5498 5.40573L17.3252 7.80855C17.5138 8.06373 17.8122 8.21429 18.1295 8.21429H20C20.5523 8.21429 21 8.662 21 9.21429V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18V9.21429C3 8.662 3.44772 8.21429 4 8.21429H5.87052C6.1878 8.21429 6.48625 8.06372 6.67479 7.80855Z"
        stroke="currentColor"
      />
      <Circle cx={12} cy={13} r={3} stroke="currentColor" />
    </IconBase>
  );
}
