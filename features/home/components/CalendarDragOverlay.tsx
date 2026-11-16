import { View } from "react-native";
import Animated from "react-native-reanimated";

import type { CalendarDrag } from "../hooks/useCalendarDrag";

import { CalendarTaskPill } from "./CalendarTaskPill";

type CalendarDragOverlayProps = {
  drag: CalendarDrag;
};

/** 끌고 있는 항목을 손가락 위치에 띄운다. 화면 최상단(절대 좌표 기준)에 둔다 */
export function CalendarDragOverlay({ drag }: CalendarDragOverlayProps) {
  return drag.dragging ? (
    // Animated.View 는 className 이 먹지 않아 위치는 style, 폭은 안쪽 View 로 준다
    <Animated.View
      pointerEvents="none"
      style={[{ position: "absolute", left: 0, top: 0 }, drag.overlayStyle]}
    >
      <View className="w-[46px]">
        <CalendarTaskPill
          title={drag.dragging.title}
          color={drag.dragging.color}
          variant={drag.dragging.kind}
        />
      </View>
    </Animated.View>
  ) : null;
}
