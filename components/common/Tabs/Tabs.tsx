import { Pressable, Text, View } from "react-native";

import { cn } from "@/lib/utils";

export type TabsProps<T extends string> = {
  /** 탭 라벨 목록. 라벨이 곧 값이다. (예: `커뮤니케이션`, `회의록`, `자료`) */
  items: readonly T[];
  /** 현재 선택된 탭 */
  value: T;
  /** 탭을 눌렀을 때 */
  onChange: (item: T) => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

/**
 * 밑줄형 탭. 선택된 탭은 진한 밑줄과 Medium 글자, 나머지는 흐린 글자를 쓴다.
 * 탭 밑줄이 바닥 구분선 위에 겹치도록 `-mb-px`로 1px 내린다.
 */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <View
      accessibilityRole="tablist"
      className={cn(
        "flex-row items-center gap-1 border-b border-gray-200",
        className
      )}
    >
      {items.map((item) => {
        const selected = item === value;

        return (
          <Pressable
            key={item}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(item)}
            className={cn(
              "-mb-px border-b px-1 pb-2",
              selected ? "border-gray-900" : "border-gray-200"
            )}
          >
            <Text
              className={cn(
                selected
                  ? "text-gray-900 text-b-04-m"
                  : "text-gray-400 text-b-04-r"
              )}
            >
              {item}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
