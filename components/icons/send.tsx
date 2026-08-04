import { Circle, Path } from "react-native-svg";
import { View } from "react-native";

import { cn } from "@/lib/utils";

import { IconBase } from "./IconBase";
import { ICON_SIZES, type IconVariant } from "./icon.types";

/**
 * 댓글 입력 등 전송 버튼에 쓰는 원형 화살표 아이콘.
 * `Up`은 배경색만 바꿀 수 있고 화살표가 흰색으로 고정돼 있어(`IconBase`가 색을 하나만 입힘),
 * 배경·화살표가 함께 바뀌어야 하는 전송 버튼 전용으로 따로 둔다.
 *
 * - `disabled=false`(기본): 파란 배경 + 흰 화살표
 * - `disabled=true`: 회색 배경 + 회색 화살표
 */
export type SendProps = {
  /** 비활성 여부. (기본값: `false`) */
  disabled?: boolean;
  /** 아이콘 크기 variant (기본값: `md` = 20px) */
  variant?: IconVariant;
  /** 바깥 여백 등 레이아웃 보정용. */
  className?: string;
};

export function Send({
  disabled = false,
  variant = "md",
  className,
}: SendProps) {
  const size = ICON_SIZES[variant];
  const bgClassName = disabled ? "text-gray-200" : "text-primary";
  const arrowClassName = disabled ? "text-gray-400" : "text-gray-0";

  return (
    <View style={{ width: size, height: size }} className={className}>
      <IconBase variant={variant} className={cn("absolute", bgClassName)}>
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
