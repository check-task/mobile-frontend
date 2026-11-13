import { Pressable, Text } from "react-native";

import { Bottom } from "@/components/icons";
import { cn } from "@/lib/utils";

export type ExpandButtonProps = {
  /** 눌렀을 때. 넘기지 않으면 탭할 수 없는 표시 전용 버튼이 된다. */
  onPress?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

/** 목록 아래에 붙는 `펼쳐보기` 알약 버튼. 세부 TASK와 자료 목록에서 쓴다. */
export function ExpandButton({ onPress, className }: ExpandButtonProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      className={cn(
        "flex-row items-center justify-center gap-1 rounded-full border border-gray-100 px-3 py-[3px]",
        className
      )}
    >
      <Text className="text-gray-600 text-b-04-r">펼쳐보기</Text>
      <Bottom variant="sm" className="text-gray-600" />
    </Pressable>
  );
}
