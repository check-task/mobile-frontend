import { Pressable, Text, View } from "react-native";

import { Add, Pencil } from "@/components/icons";
import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

import { type SubTask, SubTaskRow } from "./SubTaskRow";

export type SubTaskListProps = {
  /** 세부 TASK 목록 */
  items: readonly SubTask[];
  /** 체크박스를 눌렀을 때 */
  onToggle?: (id: string) => void;
  /** 알림 아이콘을 눌렀을 때 */
  onAlarmPress?: (id: string) => void;
  /** 제목 옆 연필 아이콘을 눌렀을 때 */
  onEditPress?: () => void;
  /** `세부과제 추가`를 눌렀을 때 */
  onAddPress?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function SubTaskList({
  items,
  onToggle,
  onAlarmPress,
  onEditPress,
  onAddPress,
  className,
}: SubTaskListProps) {
  return (
    <View className={cn("gap-4", className)}>
      <View className="flex-row items-center gap-1">
        <Text className="text-gray-900 text-b-02-m">세부 TASK</Text>
        <Pressable
          accessibilityRole={onEditPress ? "button" : undefined}
          accessibilityLabel="세부 TASK 수정"
          hitSlop={8}
          onPress={onEditPress}
        >
          <Pencil className="text-gray-900" />
        </Pressable>
      </View>

      <View style={CARD_SHADOW} className="gap-4 rounded-xl bg-bg px-3 py-4">
        <View className="gap-4">
          {items.map((item) => (
            <SubTaskRow
              key={item.id}
              title={item.title}
              dueDate={item.dueDate}
              done={item.done}
              alarm={item.alarm}
              onToggle={onToggle ? () => onToggle(item.id) : undefined}
              onAlarmPress={
                onAlarmPress ? () => onAlarmPress(item.id) : undefined
              }
            />
          ))}
        </View>

        <Pressable
          accessibilityRole={onAddPress ? "button" : undefined}
          onPress={onAddPress}
          className="flex-row items-center gap-1"
        >
          <Add variant="sm" className="text-gray-500" />
          <Text className="text-gray-500 text-b-04-r">세부과제 추가</Text>
        </Pressable>
      </View>
    </View>
  );
}
