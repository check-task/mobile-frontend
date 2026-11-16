import { Text, View } from "react-native";

import { Drag } from "@/components/icons";

import { CalendarTaskPill } from "./CalendarTaskPill";
import type { CalendarItem } from "./homeData";

type UnscheduledTasksProps = {
  items: readonly CalendarItem[];
};

// 드래그앤드롭은 #65 에서 붙인다. 여기서는 목록 표시만 한다.
export function UnscheduledTasks({ items }: UnscheduledTasksProps) {
  return (
    <View className="gap-2">
      <Text className="text-gray-800 text-b-04-r">날짜 미지정 TASK</Text>
      {items.length > 0 ? (
        <View className="flex-row flex-wrap gap-1">
          {items.map((item) => (
            <View key={item.key} className="flex-row items-center">
              <Drag variant="xs" className="text-gray-500" />
              <CalendarTaskPill
                title={item.title}
                color={item.color}
                variant="unscheduled"
              />
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
