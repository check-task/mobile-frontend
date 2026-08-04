import { Pressable, Text } from "react-native";

import { cn } from "@/lib/utils";
import type { FolderColor } from "@/types/folder.types";

import { FolderColorDot } from "../FolderColorDot/FolderColorDot";

/**
 * 칩 상태. Figma `(mobile) chip`의 `Property 1` variant와 1:1로 대응한다.
 * 어떤 화면 맥락에서 "선택됨"을 뜻하는지는 화면마다 다르므로(예: 홈은 `default`가 선택 상태,
 * 폴더 모달은 `fill`이 선택 상태) 이 컴포넌트는 외형만 결정하고 의미는 호출부가 정한다.
 *
 * - `default`: 흰 배경 + 진한 테두리/점 (Figma `100%`)
 * - `muted`: 흰 배경 + 흐린(40%) 테두리/점 (Figma `40%`)
 * - `fill`: 배경을 색으로 채우고 흰 점/글자 (Figma `fill`)
 */
export type ChipVariant = "default" | "muted" | "fill";

const COLOR_BORDER_CLASS: Record<FolderColor, string> = {
  "sub-01": "border-sub-01",
  "sub-02": "border-sub-02",
  "sub-03": "border-sub-03",
  "sub-04": "border-sub-04",
  "sub-05": "border-sub-05",
  "sub-null": "border-sub-null",
};

const COLOR_BORDER_MUTED_CLASS: Record<FolderColor, string> = {
  "sub-01": "border-sub-01/40",
  "sub-02": "border-sub-02/40",
  "sub-03": "border-sub-03/40",
  "sub-04": "border-sub-04/40",
  "sub-05": "border-sub-05/40",
  "sub-null": "border-sub-null/40",
};

const COLOR_BG_CLASS: Record<FolderColor, string> = {
  "sub-01": "bg-sub-01",
  "sub-02": "bg-sub-02",
  "sub-03": "bg-sub-03",
  "sub-04": "bg-sub-04",
  "sub-05": "bg-sub-05",
  "sub-null": "bg-sub-null",
};

const CONTAINER_CLASS_BY_VARIANT: Record<
  ChipVariant,
  (color: FolderColor) => string
> = {
  default: (color) => cn("bg-gray-0", COLOR_BORDER_CLASS[color]),
  muted: (color) => cn("bg-gray-0", COLOR_BORDER_MUTED_CLASS[color]),
  fill: (color) => cn(COLOR_BG_CLASS[color], COLOR_BORDER_CLASS[color]),
};

const TEXT_CLASS_BY_VARIANT: Record<ChipVariant, string> = {
  default: "text-gray-900",
  muted: "text-gray-600",
  fill: "text-primary-button-text",
};

const DOT_CLASS_BY_VARIANT: Record<ChipVariant, string> = {
  default: "",
  muted: "opacity-40",
  // fill 상태의 점은 색을 지정하지 않고 항상 흰색이다.
  fill: "bg-gray-0",
};

export type ChipProps = {
  /** 칩에 표시할 라벨 텍스트 */
  label: string;
  /** 칩 색상. 폴더 색상 토큰과 1:1 대응한다. (기본값: `sub-null`) */
  color?: FolderColor;
  /** 칩 상태. (기본값: `default`) */
  variant?: ChipVariant;
  /** 칩을 탭했을 때 */
  onPress?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

/**
 * 폴더 색상을 나타내는 점 + 라벨로 구성된 알약 모양 칩.
 * 홈 화면의 폴더 선택, 폴더 생성/수정 모달의 색상 선택, 과제 등록/수정의 폴더 선택 등에서 쓴다.
 */
export function Chip({
  label,
  color = "sub-null",
  variant = "default",
  onPress,
  className,
}: ChipProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-0.5 rounded-full border px-2 py-1",
        CONTAINER_CLASS_BY_VARIANT[variant](color),
        className
      )}
    >
      <FolderColorDot
        color={color}
        size="2xs"
        className={DOT_CLASS_BY_VARIANT[variant]}
      />
      <Text className={cn(TEXT_CLASS_BY_VARIANT[variant], "text-caption")}>
        {label}
      </Text>
    </Pressable>
  );
}
