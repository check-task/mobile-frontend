import { Pressable, Text, View } from "react-native";

import { AlarmDefault, Cancel } from "@/components/icons";
import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

/** 알림 읽음 상태. Figma `(mobile) 알림`의 `Property 1` variant와 대응한다. */
export type AlarmItemStatus = "new" | "read";

export type AlarmItemProps = {
  /** 알림 제목 (예: `'과제명'의 마감까지 NN시간 남았어요!`) */
  title: string;
  /** 알림 부가 설명 (예: `현재 NN% 완성 중이에요. 빨리 끝내고 쉬어요!`) */
  description: string;
  /** 읽음 상태. `read`면 전체가 흐리게 표시된다. (기본값: `new`) */
  status?: AlarmItemStatus;
  /** 알림 항목을 탭했을 때 */
  onPress?: () => void;
  /** 닫기(X) 버튼을 탭했을 때. 넘기지 않으면 닫기 버튼을 렌더링하지 않는다. */
  onDismiss?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

/**
 * 알림 목록에서 사용하는 공용 알림 카드.
 *
 * 너비는 지정하지 않으므로(Figma 358px = 화면 좌우 20px 여백) 부모에서 제어한다.
 */
export function AlarmItem({
  title,
  description,
  status = "new",
  onPress,
  onDismiss,
  className,
}: AlarmItemProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      style={CARD_SHADOW}
      className={cn(
        "flex-row items-center justify-between gap-2 rounded-lg bg-blue-50 px-3 py-4",
        status === "read" && "opacity-40",
        className
      )}
    >
      <View className="flex-1 flex-row items-center gap-2">
        <AlarmDefault className="text-blue-500" />
        <View className="flex-1 gap-1">
          <Text className="text-gray-900 text-b-02-m">{title}</Text>
          <Text className="text-gray-600 text-b-04-r">{description}</Text>
        </View>
      </View>

      {onDismiss ? (
        <Pressable
          accessibilityLabel="알림 닫기"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onDismiss}
        >
          <Cancel className="text-gray-600" />
        </Pressable>
      ) : null}
    </Pressable>
  );
}
