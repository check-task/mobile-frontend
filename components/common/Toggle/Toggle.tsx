import { Pressable, View } from "react-native";

import { cn } from "@/lib/utils";

export type ToggleProps = {
  /** 켜짐 여부 */
  value: boolean;
  /** 눌렀을 때 바뀔 값을 넘겨 준다. */
  onValueChange: (value: boolean) => void;
  /** 스크린 리더용 설명. 옆에 보이는 라벨 텍스트가 없을 때만 넘긴다. */
  accessibilityLabel?: string;
  /** 바깥 여백 등 레이아웃 보정용. */
  className?: string;
};

/** Figma `(mobile) 토글`(32×16)을 옮긴 스위치. */
export function Toggle({
  value,
  onValueChange,
  accessibilityLabel,
  className,
}: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
      className={cn(
        "h-4 w-8 flex-row items-center rounded-full px-0.5",
        value ? "justify-end bg-primary" : "justify-start bg-gray-300",
        className
      )}
    >
      <View className="h-3 w-3 rounded-full bg-gray-0" />
    </Pressable>
  );
}
