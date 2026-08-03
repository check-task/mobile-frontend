import { Circle, Path } from "react-native-svg";
import { View } from "react-native";

import { cn } from "@/lib/utils";

import { IconBase } from "./IconBase";
import { ICON_SIZES, type IconVariant } from "./icon.types";

/**
 * 원형 배경 + 화살표로 된 전송 아이콘.
 * `IconBase`는 아이콘 전체에 색을 하나만 입힐 수 있어(currentColor 하나), 배경과 화살표가
 * 함께 바뀌는 댓글 입력의 전송 버튼(비활성=회색 배경/회색 화살표, 활성=파란 배경/흰 화살표)을 위해
 * `IconBase`를 두 겹 겹쳐 배경 색과 화살표 색을 독립적으로 지정한다.
 */
export type SendProps = {
  /** 원형 배경 색. (기본값: `text-gray-200`) */
  className?: string;
  /** 화살표 색. (기본값: `text-gray-0`=흰색) */
  arrowClassName?: string;
  /** 아이콘 크기 variant (기본값: `md` = 20px) */
  variant?: IconVariant;
};

export function Send({
  className = "text-gray-200",
  arrowClassName = "text-gray-0",
  variant = "md",
}: SendProps) {
  const size = ICON_SIZES[variant];

  return (
    <View style={{ width: size, height: size }}>
      <IconBase variant={variant} className={cn("absolute", className)}>
        <Circle cx={12} cy={12} r={12} fill="currentColor" />
      </IconBase>
      <IconBase variant={variant} className={cn("absolute", arrowClassName)}>
        <Path
          d="M7 11L11.0781 6.10624C11.5579 5.53053 12.4421 5.53053 12.9219 6.10624L17 11"
          stroke="currentColor"
          strokeLinecap="round"
        />
        <Path d="M12 6L12 19" stroke="currentColor" strokeLinecap="round" />
      </IconBase>
    </View>
  );
}
