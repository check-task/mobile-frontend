import { Pressable, Text, View } from "react-native";

import { Re } from "@/components/icons";
import { SNACKBAR_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

export type SnackbarProps = {
  /** 표시할 메시지 (예: `TEST 1-1이 삭제되었습니다`) */
  message: string;
  /** `되돌리기`를 눌렀을 때. 넘기지 않으면 되돌리기 버튼을 그리지 않는다. */
  onUndo?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

/**
 * 삭제 같은 동작 뒤에 하단 액션(`되돌리기`)과 함께 잠깐 떠 있는 알림.
 * 노출/사라짐 타이밍과 화면상 위치는 호출부가 제어한다.
 */
export function Snackbar({ message, onUndo, className }: SnackbarProps) {
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={SNACKBAR_SHADOW}
      className={cn(
        "flex-row items-center justify-between gap-2 rounded-lg bg-blue-50 px-4 py-3",
        className
      )}
    >
      <Text className="flex-1 text-gray-800 text-b-03-r">{message}</Text>
      {onUndo ? (
        <Pressable
          accessibilityRole="button"
          onPress={onUndo}
          hitSlop={8}
          className="flex-row items-center gap-1 rounded-full border border-blue-600 bg-gray-0 py-[3px] pl-[3px] pr-[7px]"
        >
          <Re variant="sm" className="text-blue-600" />
          <Text className="text-blue-600 text-caption">되돌리기</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
