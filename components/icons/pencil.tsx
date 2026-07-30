import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function Pencil(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path
        d="M15.5355 4.2218L6.31624 13.441C6.15082 13.6064 6.04863 13.8246 6.02745 14.0576L5.74461 17.1689C5.68807 17.7908 6.2091 18.3118 6.83104 18.2553L9.94231 17.9724C10.1753 17.9513 10.3935 17.8491 10.5589 17.6837L19.7781 8.46444C20.1686 8.07392 20.1686 7.44075 19.7781 7.05023L16.9497 4.2218C16.5592 3.83128 15.926 3.83128 15.5355 4.2218Z"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path
        d="M6.34326 13.4142L10.5859 17.6568"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <Path
        d="M14.8286 4.92896L19.0713 9.1716"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
