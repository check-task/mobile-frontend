import { Text, View } from "react-native";

import { Drag } from "@/components/icons";

import type { CalendarDrag } from "../hooks/useCalendarDrag";

import { CalendarTaskPill } from "./CalendarTaskPill";
import { DraggableCalendarPill } from "./DraggableCalendarPill";
import type { CalendarItem } from "./homeData";

type UnscheduledTasksProps = {
  items: readonly CalendarItem[];
  drag: CalendarDrag;
};

export function UnscheduledTasks({ items, drag }: UnscheduledTasksProps) {
  return (
    // 영역 전체가 세부 task 를 미지정으로 되돌리는 드롭 영역이다
    <View ref={drag.zoneRef(null)} className="gap-2">
      <Text className="text-gray-800 text-b-04-r">날짜 미지정 TASK</Text>
      {items.length > 0 ? (
        <View className="flex-row flex-wrap gap-1">
          {items.map((item) => (
            <DraggableCalendarPill key={item.key} item={item} drag={drag}>
              <Drag variant="xs" className="text-gray-500" />
              <CalendarTaskPill
                title={item.title}
                color={item.color}
                variant="unscheduled"
              />
            </DraggableCalendarPill>
          ))}
        </View>
      ) : null}
    </View>
  );
}
