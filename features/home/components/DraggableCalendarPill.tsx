import type { ReactNode } from "react";
import { View } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";

import { cn } from "@/lib/utils";

import type { CalendarDrag } from "../hooks/useCalendarDrag";

import type { CalendarItem } from "./homeData";

// 스크롤·날짜 칸 탭과 구분하려고 길게 누른 뒤에만 끌 수 있다
const LONG_PRESS_MS = 300;

type DraggableCalendarPillProps = {
  item: CalendarItem;
  drag: CalendarDrag;
  children: ReactNode;
};

export function DraggableCalendarPill({
  item,
  drag,
  children,
}: DraggableCalendarPillProps) {
  const gesture = usePanGesture({
    activateAfterLongPress: LONG_PRESS_MS,
    runOnJS: true,
    onActivate: (e) => drag.start(item, e),
    onUpdate: drag.move,
    onDeactivate: (e) => drag.end(item, e, e.canceled),
  });

  return (
    <GestureDetector gesture={gesture}>
      <View
        accessibilityHint="길게 눌러 다른 날짜로 옮길 수 있습니다"
        className={cn(
          "max-w-full flex-row items-center",
          drag.dragging?.key === item.key ? "opacity-30" : ""
        )}
      >
        {children}
      </View>
    </GestureDetector>
  );
}
