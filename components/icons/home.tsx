import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Home(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M11.4 3.45L3.4 9.45C3.14819 9.63885 3 9.93524 3 10.25V20C3 20.5523 3.44772 21 4 21H8.75C9.30228 21 9.75 20.5523 9.75 20V15.25C9.75 14.6977 10.1977 14.25 10.75 14.25H13.25C13.8023 14.25 14.25 14.6977 14.25 15.25V20C14.25 20.5523 14.6977 21 15.25 21H20C20.5523 21 21 20.5523 21 20V10.25C21 9.93524 20.8518 9.63885 20.6 9.45L12.6 3.45C12.2444 3.18333 11.7556 3.18333 11.4 3.45Z"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
