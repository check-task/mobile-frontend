import { type ComponentRef, useRef, useState } from "react";
import type { View } from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import type { CalendarItem } from "../components/homeData";

/** 드롭 영역 키. 날짜 칸은 `YYYY-MM-DD`, 날짜 미지정 영역은 `null` */
export type DropZone = string | null;

type PointerEvent = {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
};
const DROP_TAP_GUARD_MS = 300;

type ZoneView = ComponentRef<typeof View>;
type Rect = { x: number; y: number; width: number; height: number };

export type CalendarDrag = ReturnType<typeof useCalendarDrag>;

// 드롭 영역을 등록해 두고, 끌고 있는 항목을 화면 좌표로 따라가다 놓은 영역을 onDrop 으로 알린다.
// 영역 밖에 놓으면 아무것도 하지 않아 원래 자리로 돌아간다.
export function useCalendarDrag(
  onDrop: (item: CalendarItem, zone: DropZone) => void
) {
  const zoneViews = useRef(new Map<DropZone, ZoneView>());
  const zoneRects = useRef(new Map<DropZone, Rect>());
  const grabOffset = useRef({ x: 0, y: 0 });
  const endedAt = useRef(0);
  const [dragging, setDragging] = useState<CalendarItem | null>(null);
  const left = useSharedValue(0);
  const top = useSharedValue(0);

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: left.get() }, { translateY: top.get() }],
  }));

  const zoneRef = (zone: DropZone) => (view: ZoneView | null) => {
    if (view) zoneViews.current.set(zone, view);
    else zoneViews.current.delete(zone);
  };

  const move = (e: PointerEvent) => {
    left.set(e.absoluteX - grabOffset.current.x);
    top.set(e.absoluteY - grabOffset.current.y);
  };

  const start = (item: CalendarItem, e: PointerEvent) => {
    grabOffset.current = { x: e.x, y: e.y };
    move(e);
    setDragging(item);
    // 드래그 중에는 스크롤을 막으므로 시작할 때 한 번만 재면 된다
    zoneRects.current.clear();
    zoneViews.current.forEach((view, zone) =>
      view.measureInWindow((x, y, width, height) =>
        zoneRects.current.set(zone, { x, y, width, height })
      )
    );
  };

  const end = (item: CalendarItem, e: PointerEvent, canceled: boolean) => {
    endedAt.current = Date.now();
    setDragging(null);
    if (canceled) return;
    for (const [zone, rect] of zoneRects.current) {
      if (
        e.absoluteX >= rect.x &&
        e.absoluteX <= rect.x + rect.width &&
        e.absoluteY >= rect.y &&
        e.absoluteY <= rect.y + rect.height
      ) {
        onDrop(item, zone);
        return;
      }
    }
  };

  // 웹은 포인터를 캡처해 놓은 직후 출발 칸에 click 이 한 번 더 들어온다. 그 탭은 무시한다
  const isJustDropped = () => Date.now() - endedAt.current < DROP_TAP_GUARD_MS;

  return { dragging, overlayStyle, zoneRef, start, move, end, isJustDropped };
}
