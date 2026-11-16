import { Pressable, ScrollView, Text, View } from "react-native";

import { Chip } from "@/components/common/Chip/Chip";
import { Left, Right } from "@/components/icons";

import type { HomeFolder } from "../api/home.types";

type CalendarHeaderProps = {
  year: number;
  /** 0 = 1월 */
  month: number;
  onTitlePress: () => void;
  onMonthMove: (offset: number) => void;
  folders: readonly HomeFolder[];
  /** 비어 있으면 전체 선택으로 본다 */
  selectedFolderIds: ReadonlySet<number>;
  onToggleFolder: (id: number) => void;
};

export function CalendarHeader({
  year,
  month,
  onTitlePress,
  onMonthMove,
  folders,
  selectedFolderIds,
  onToggleFolder,
}: CalendarHeaderProps) {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${year}년 ${month + 1}월, 월 선택`}
          onPress={onTitlePress}
        >
          <Text className="text-gray-900 text-h-01">{`${year}년 ${month + 1}월`}</Text>
        </Pressable>
        <View className="flex-row gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="이전 달"
            hitSlop={8}
            onPress={() => onMonthMove(-1)}
          >
            <Left variant="lg" className="text-gray-900" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="다음 달"
            hitSlop={8}
            onPress={() => onMonthMove(1)}
          >
            <Right variant="lg" className="text-gray-900" />
          </Pressable>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {folders.map((folder) => {
          const isSelected =
            selectedFolderIds.size === 0 || selectedFolderIds.has(folder.id);
          return (
            <Chip
              key={folder.id}
              label={folder.name}
              color={folder.color}
              // 홈은 default 가 선택, muted 가 해제 상태다
              variant={isSelected ? "default" : "muted"}
              selected={isSelected}
              onPress={() => onToggleFolder(folder.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
