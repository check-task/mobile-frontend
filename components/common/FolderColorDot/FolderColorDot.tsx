import { View } from "react-native";

import { cn } from "@/lib/utils";
import type { FolderColor } from "@/types/folder.types";

/** 점 크기. Figma `(mobile) chip`은 10px, 폴더 필터는 12px, 과제 카드는 16px을 쓴다. */
export type FolderColorDotSize = "2xs" | "xs" | "sm";

const DOT_SIZE_CLASS: Record<FolderColorDotSize, string> = {
  "2xs": "h-2.5 w-2.5",
  xs: "h-3 w-3",
  sm: "h-4 w-4",
};

const DOT_COLOR_CLASS: Record<FolderColor, string> = {
  "sub-01": "bg-sub-01",
  "sub-02": "bg-sub-02",
  "sub-03": "bg-sub-03",
  "sub-04": "bg-sub-04",
  "sub-05": "bg-sub-05",
  "sub-null": "bg-sub-null",
};

export type FolderColorDotProps = {
  /** 폴더 색상. (기본값: `sub-null`) */
  color?: FolderColor;
  /** 점 크기. `2xs`=10px, `xs`=12px, `sm`=16px (기본값: `sm`) */
  size?: FolderColorDotSize;
  /** 바깥 여백 등 레이아웃 보정용. */
  className?: string;
};

/** 폴더를 나타내는 색상 점. 폴더 필터·과제 카드 등 폴더 라벨 앞에 붙인다. */
export function FolderColorDot({
  color = "sub-null",
  size = "sm",
  className,
}: FolderColorDotProps) {
  return (
    <View
      className={cn(
        "rounded-full",
        DOT_SIZE_CLASS[size],
        DOT_COLOR_CLASS[color],
        className
      )}
    />
  );
}
