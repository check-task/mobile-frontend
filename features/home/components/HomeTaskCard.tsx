import { Pressable, Text, View } from "react-native";

import {
  FOLDER_BG_CLASS,
  FOLDER_TEXT_CLASS,
} from "@/constants/folderColorClass";
import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";
import type { FolderColor } from "@/types/folder.types";

type HomeTaskCardProps = {
  folderName: string;
  color: FolderColor;
  title: string;
  typeLabel: string;
  dDay: string;
  progressRate: number;
  onPress: () => void;
};

// Figma `(mobile) 과제 목록 BOX`. 공용 TaskCard 와 구성(D-day 위치, 진척도 바)이 달라 홈 전용으로 둔다.
export function HomeTaskCard({
  folderName,
  color,
  title,
  typeLabel,
  dDay,
  progressRate,
  onPress,
}: HomeTaskCardProps) {
  const percent = Math.min(100, Math.max(0, Math.round(progressRate)));

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={CARD_SHADOW}
      className="flex-row items-center gap-5 rounded-lg bg-gray-0 px-4 py-5"
    >
      <View
        className={cn(
          "absolute -left-0.5 top-3 h-[90px] w-1",
          FOLDER_BG_CLASS[color]
        )}
      />
      <View className="w-20 items-start gap-[34px]">
        <Text
          numberOfLines={1}
          className={cn("text-b-04-m", FOLDER_TEXT_CLASS[color])}
        >
          {folderName}
        </Text>
        <View className={cn("rounded px-2 py-0.5", FOLDER_BG_CLASS[color])}>
          <Text className="text-primary-button-text text-b-04-m">{dDay}</Text>
        </View>
      </View>
      <View className="flex-1 gap-1">
        <View className="gap-0.5">
          <View className="flex-row items-center gap-2">
            <View
              className={cn("size-5 rounded-full", FOLDER_BG_CLASS[color])}
            />
            <Text
              numberOfLines={1}
              className="flex-1 text-gray-900 text-b-01-m"
            >
              {title}
            </Text>
          </View>
          <Text className="pl-7 text-gray-400 text-b-04-r">{typeLabel}</Text>
        </View>
        <View className="gap-0.5 pl-7">
          <Text className="text-gray-900 text-b-04-r">{`${percent}%`}</Text>
          <View className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            {/* 채움 폭은 런타임 값이라 style 로 넘긴다. */}
            <View
              className={cn("h-1.5 rounded-full", FOLDER_BG_CLASS[color])}
              style={{ width: `${percent}%` }}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
