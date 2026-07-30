import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function BottomFill(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M16.7929 10C17.2383 10 17.4614 10.5386 17.1464 10.8536L12.7071 15.2929C12.3166 15.6834 11.6834 15.6834 11.2929 15.2929L6.85355 10.8536C6.53857 10.5386 6.76165 10 7.20711 10H16.7929Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
