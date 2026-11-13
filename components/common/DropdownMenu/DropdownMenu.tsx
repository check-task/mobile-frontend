import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { DROPDOWN_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

/**
 * 메뉴 종류. Figma 드롭다운 3종의 행 높이·글자·배경이 서로 달라 한 축으로 묶었다.
 *
 * - `avatar`: TASK 담당 설정. 행 32px, 10px 글자, `gray-0` 배경, 앞에 프로필 이미지
 * - `comment`: 댓글 수정/삭제. 행 30px, 10px 글자, 페이지 배경
 * - `leader`: 팀장 설정/팀원 삭제. 행 26px, 12px 글자, 페이지 배경
 */
export type DropdownMenuVariant = "avatar" | "comment" | "leader";

const CONTAINER_CLASS_BY_VARIANT: Record<DropdownMenuVariant, string> = {
  avatar: "bg-gray-0",
  comment: "bg-bg",
  leader: "bg-bg",
};

const ROW_CLASS_BY_VARIANT: Record<DropdownMenuVariant, string> = {
  avatar: "h-8 px-2",
  comment: "h-[30px] px-3",
  leader: "h-[26px] px-3",
};

const TEXT_CLASS_BY_VARIANT: Record<DropdownMenuVariant, string> = {
  avatar: "text-gray-800 text-caption",
  comment: "text-gray-700 text-caption",
  leader: "text-gray-700 text-b-04-r",
};

export type DropdownMenuItem<K extends string> = {
  /** 항목을 구분하는 값. `onSelect`로 그대로 돌려 준다. */
  key: K;
  /** 항목 문구 (예: `댓글 수정`) */
  label: string;
  /** 문구 앞에 붙는 요소 (예: 멤버 프로필 이미지) */
  leading?: ReactNode;
};

export type DropdownMenuProps<K extends string> = {
  /** 메뉴 항목 목록 */
  items: readonly DropdownMenuItem<K>[];
  /** 항목을 눌렀을 때 */
  onSelect: (key: K) => void;
  /** 메뉴 종류. (기본값: `avatar`) */
  variant?: DropdownMenuVariant;
  /** 바깥 여백·위치 보정용. 너비는 내용에 맞춰지고 위치는 호출부가 정한다. */
  className?: string;
};

/**
 * 댓글 수정/삭제, TASK 담당 설정, 팀장 설정/팀원 삭제처럼 항목 사이를 선으로 나눈 드롭다운 메뉴.
 * 그림자가 잘리지 않도록 `overflow-hidden`을 쓰지 않는다.
 */
export function DropdownMenu<K extends string>({
  items,
  onSelect,
  variant = "avatar",
  className,
}: DropdownMenuProps<K>) {
  return (
    <View
      style={DROPDOWN_SHADOW}
      className={cn(
        "self-start rounded",
        CONTAINER_CLASS_BY_VARIANT[variant],
        className
      )}
    >
      {items.map((item, index) => (
        <Pressable
          key={item.key}
          accessibilityRole="menuitem"
          onPress={() => onSelect(item.key)}
          className={cn(
            "flex-row items-center gap-1 border-gray-100",
            ROW_CLASS_BY_VARIANT[variant],
            index < items.length - 1 ? "border-b" : ""
          )}
        >
          {item.leading}
          <Text className={TEXT_CLASS_BY_VARIANT[variant]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
