import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";

import { CheckBoxMark } from "@/components/icons";
import { cn } from "@/lib/utils";

// Figma 명세엔 트랜지션이 없지만, 토글 시 체크 표시가 뚝 끊겨 보이지 않도록 짧은 페이드를 더한다.
const FADE_DURATION_MS = 150;

export type CheckboxProps = {
  /** 체크 여부 */
  checked: boolean;
  /** 눌렀을 때. 넘기지 않으면 탭할 수 없는 표시 전용 체크박스가 된다. */
  onPress?: () => void;
  /** 스크린 리더용 설명. 옆에 보이는 라벨 텍스트가 없을 때만 넘긴다. */
  accessibilityLabel?: string;
  /** 바깥 여백 등 레이아웃 보정용. */
  className?: string;
};

/**
 * Figma `(mobile) checkbox`의 `icon-box`/`icon-check box` variant를 옮긴 체크박스.
 * 탭 영역은 24px, 실제 박스는 16px(4px 인셋)이다.
 * 박스 테두리는 체크 여부와 무관하게 항상 그리고, 체크 표시만 겹쳐서 페이드시킨다.
 */
export function Checkbox({
  checked,
  onPress,
  accessibilityLabel,
  className,
}: CheckboxProps) {
  const checkedOpacity = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(checkedOpacity, {
      toValue: checked ? 1 : 0,
      duration: FADE_DURATION_MS,
      useNativeDriver: true,
    }).start();
  }, [checked, checkedOpacity]);

  return (
    <Pressable
      accessibilityRole={onPress ? "checkbox" : undefined}
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      className={cn("h-6 w-6 items-center justify-center", className)}
    >
      <View className="h-4 w-4 rounded-[1px] border border-gray-600" />
      {/* Animated.View는 nativewind의 cssInterop이 등록돼 있지 않아 className이 먹지 않는다. */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          opacity: checkedOpacity,
        }}
      >
        <CheckBoxMark variant="lg" className="text-gray-600" />
      </Animated.View>
    </Pressable>
  );
}
