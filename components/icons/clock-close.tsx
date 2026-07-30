import { Path } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

export function ClockClose(props: IconProps) {
  return (
    <IconBase {...props}>
      <Path d="M17 4L20 7" stroke="currentColor" strokeLinecap="round" />
      <Path d="M5.5 5.5L4 7" stroke="currentColor" strokeLinecap="round" />
      <Path d="M4 4L20 20" stroke="currentColor" strokeLinecap="round" />
      <Path
        d="M12 5.5C10.9031 5.5 9.86163 5.7364 8.92267 6.15992C8.61434 6.29899 8.55911 6.70071 8.79828 6.93989C8.95471 7.09631 9.19322 7.13246 9.39584 7.04369C10.1932 6.69439 11.0738 6.5 12 6.5C15.5899 6.5 18.5 9.41015 18.5 13C18.5 13.9262 18.3056 14.8068 17.9563 15.6042C17.8675 15.8068 17.9037 16.0453 18.0601 16.2017C18.2993 16.4409 18.701 16.3857 18.8401 16.0773C19.2636 15.1384 19.5 14.0969 19.5 13C19.5 8.85786 16.1421 5.5 12 5.5Z"
        fill="currentColor"
      />
      <Path
        d="M7.53906 7C5.6953 8.36641 4.5 10.5582 4.5 13.0293C4.5 17.1714 7.85786 20.5293 12 20.5293C14.4711 20.5293 16.6629 19.334 18.0293 17.4902L17.3115 16.7725C16.1347 18.4393 14.1955 19.5293 12 19.5293C8.41015 19.5293 5.5 16.6191 5.5 13.0293C5.5 10.8338 6.59002 8.89458 8.25684 7.71777L7.53906 7Z"
        fill="currentColor"
      />
    </IconBase>
  );
}
