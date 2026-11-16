import { Pressable, Text, View } from "react-native";

import { FolderColorDot } from "@/components/common/FolderColorDot/FolderColorDot";
import {
  FOLDER_BG_CLASS,
  FOLDER_TEXT_CLASS,
} from "@/constants/folderColorClass";
import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";
import type { FolderColor } from "@/types/folder.types";

export type DayTaskItem = {
  key: string;
  folderName: string;
  color: FolderColor;
  title: string;
  onPress: () => void;
};

type DayTasksModalContentProps = {
  items: readonly DayTaskItem[];
};

export function DayTasksModalContent({ items }: DayTasksModalContentProps) {
  return (
    <View className="gap-3 pb-5 pt-4">
      {items.length === 0 ? (
        <Text className="py-4 text-center text-gray-400 text-b-03-r">
          등록된 과제가 없어요
        </Text>
      ) : (
        items.map((item) => (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            onPress={item.onPress}
            style={CARD_SHADOW}
            className="gap-1 rounded bg-gray-0 px-3 py-2"
          >
            <View
              className={cn(
                "absolute -left-px top-3 h-[30px] w-0.5",
                FOLDER_BG_CLASS[item.color]
              )}
            />
            <View className="flex-row items-center gap-1">
              <FolderColorDot color={item.color} size="xs" />
              <Text
                className={cn("text-caption", FOLDER_TEXT_CLASS[item.color])}
              >
                {item.folderName}
              </Text>
            </View>
            <Text className="text-gray-900 text-b-03-m">{item.title}</Text>
          </Pressable>
        ))
      )}
    </View>
  );
}
