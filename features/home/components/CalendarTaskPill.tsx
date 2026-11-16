import { Text, View } from "react-native";

import {
  FOLDER_BG_CLASS,
  FOLDER_BORDER_CLASS,
  FOLDER_TEXT_CLASS,
} from "@/constants/folderColorClass";
import { cn } from "@/lib/utils";
import type { FolderColor } from "@/types/folder.types";

/**
 * - `main`: 과제. 폴더색 배경 + 흰 글자
 * - `sub`: 세부 task. 흰 배경 + 폴더색 테두리/글자
 * - `unscheduled`: 날짜 미지정 영역의 세부 task (조금 더 큰 글자, 고정 폭)
 */
export type CalendarTaskPillVariant = "main" | "sub" | "unscheduled";

type CalendarTaskPillProps = {
  title: string;
  color: FolderColor;
  variant: CalendarTaskPillVariant;
};

export function CalendarTaskPill({
  title,
  color,
  variant,
}: CalendarTaskPillProps) {
  const isMain = variant === "main";

  return (
    <View
      className={cn(
        "flex-row items-center rounded-sm py-px",
        isMain
          ? FOLDER_BG_CLASS[color]
          : cn("border-[0.5px] bg-gray-0", FOLDER_BORDER_CLASS[color]),
        variant === "unscheduled" ? "w-[46px] px-1" : "max-w-full px-0.5"
      )}
    >
      <Text
        numberOfLines={1}
        className={cn(
          variant === "unscheduled" ? "text-calendar" : "text-calendar-2",
          isMain ? "text-primary-button-text" : FOLDER_TEXT_CLASS[color]
        )}
      >
        {title}
      </Text>
    </View>
  );
}
