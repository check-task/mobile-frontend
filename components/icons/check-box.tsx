import { Path, Rect } from "react-native-svg";

import { IconBase } from "./IconBase";
import type { IconProps } from "./icon.types";

/** 체크박스 안에 들어가는 체크 표시 path. `CheckBoxMark`/`CheckBox`가 함께 쓴다. */
function CheckMarkPath() {
  return (
    <Path
      d="M8 12L10.2506 15.376C10.4486 15.6728 10.8848 15.6728 11.0827 15.376L16 8"
      stroke="currentColor"
      strokeLinecap="round"
    />
  );
}

/** 체크박스 안에 들어가는 체크 표시만 그린다. 테두리는 호출부가 별도로 그린다. */
export function CheckBoxMark(props: IconProps) {
  return (
    <IconBase {...props}>
      <CheckMarkPath />
    </IconBase>
  );
}

export function CheckBox(props: IconProps) {
  return (
    <IconBase {...props}>
      <Rect x={4} y={4} width={16} height={16} rx={1} stroke="currentColor" />
      <CheckMarkPath />
    </IconBase>
  );
}
