import { G, Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Link(props: IconProps) {
  return (
    <IconBase {...props}>
      <G />
      <Path
        d="M9.17139 14.8284L14.8282 9.17158"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path
        d="M14.1212 15.5355L11.2928 18.364C9.73069 19.9261 7.19803 19.9261 5.63593 18.364C4.07383 16.8019 4.07383 14.2692 5.63593 12.7071L8.46436 9.87867"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path
        d="M15.5355 14.1213L18.364 11.2929C19.9261 9.73081 19.9261 7.19815 18.364 5.63605C16.8019 4.07395 14.2692 4.07395 12.7071 5.63605L9.87867 8.46448"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
