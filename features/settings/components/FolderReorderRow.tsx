import { useRef } from "react";
import { Text, View } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";

import { FolderColorDot } from "@/components/common/FolderColorDot/FolderColorDot";
import { Align } from "@/components/icons";
import { cn } from "@/lib/utils";

import type { SettingsFolder } from "./settingsData";

type FolderReorderRowProps = {
  folder: SettingsFolder;
  /** 드래그 중 위아래로 밀려나는 거리(px) */
  offsetY: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragMove: (dy: number) => void;
  /** 시스템이 제스처를 끊으면 `canceled` 가 true */
  onDragEnd: (dy: number, canceled: boolean) => void;
  /** 스크린리더의 위로/아래로 이동 동작 (-1 위, +1 아래) */
  onMove: (delta: -1 | 1) => void;
  /** 핸들을 누르고 있는 동안 true. 부모 스크롤을 잠그는 데 쓴다 */
  onHoldChange: (holding: boolean) => void;
};

export function FolderReorderRow({
  folder,
  offsetY,
  isDragging,
  onDragStart,
  onDragMove,
  onDragEnd,
  onHoldChange,
  onMove,
}: FolderReorderRowProps) {
  // translationY 는 플랫폼에 따라 활성화 시점부터 세서, 누른 지점 기준으로 직접 잰다
  const startY = useRef(0);
  const gesture = usePanGesture({
    runOnJS: true,
    // 손을 대는 순간 스크롤을 잠가야 스크롤이 드래그를 가로채지 않는다
    onBegin: (e) => {
      startY.current = e.absoluteY;
      onHoldChange(true);
    },
    onFinalize: () => onHoldChange(false),
    onActivate: onDragStart,
    onUpdate: (e) => onDragMove(e.absoluteY - startY.current),
    onDeactivate: (e) => onDragEnd(e.absoluteY - startY.current, e.canceled),
  });

  return (
    <View
      style={{ transform: [{ translateY: offsetY }] }}
      className={cn(
        "h-[49px] flex-row items-center justify-between border-t border-gray-100 bg-gray-0",
        isDragging ? "z-10 opacity-80" : ""
      )}
    >
      <View className="flex-row items-center gap-2">
        <FolderColorDot color={folder.color} className="h-5 w-5" />
        <Text className="text-gray-700 text-b-02-m">{folder.name}</Text>
      </View>
      <GestureDetector gesture={gesture}>
        <View
          accessible
          accessibilityLabel={`${folder.name} 순서 이동`}
          accessibilityHint="위아래로 끌어 순서를 바꿉니다"
          accessibilityActions={[
            { name: "moveUp", label: "위로 이동" },
            { name: "moveDown", label: "아래로 이동" },
          ]}
          onAccessibilityAction={(e) =>
            onMove(e.nativeEvent.actionName === "moveUp" ? -1 : 1)
          }
          hitSlop={8}
          className="size-6 items-center justify-center rounded-full bg-gray-100"
        >
          <Align variant="md" className="text-gray-400" />
        </View>
      </GestureDetector>
    </View>
  );
}
