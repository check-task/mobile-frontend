import { Text, View } from "react-native";

import { cn } from "@/lib/utils";

export type CompletionRateProps = {
  /** 완료율(0~100). 범위를 벗어난 값은 0 또는 100으로 맞춘다. */
  percent: number;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

/**
 * 과제 상단의 완료율 표시. `완료율` 라벨 + 퍼센트 숫자와 진행 바로 구성된다.
 * Figma `완료율` 프레임에서 폴더 점 아래로 들여쓴 32px 여백은 호출부가 정한다.
 */
export function CompletionRate({ percent, className }: CompletionRateProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));

  return (
    <View className={cn("gap-1", className)}>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-700 text-b-04-r">완료율</Text>
        <Text className="text-gray-900 text-b-04-m">{`${clamped}%`}</Text>
      </View>
      <View className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        {/* 채움 폭은 런타임 값이라 className으로 표현할 수 없어 style로 넘긴다. */}
        <View
          className="h-2 rounded-full bg-blue-300"
          style={{ width: `${clamped}%` }}
        />
      </View>
    </View>
  );
}
