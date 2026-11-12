import { Pressable, Text, View } from "react-native";

import { Add } from "@/components/icons";
import { cn } from "@/lib/utils";

import { ResourceItem } from "./ResourceItem";

export type Resource = {
  id: string;
  title: string;
  link: string;
};

export type ResourceSectionProps = {
  /** 자료 목록 */
  items: readonly Resource[];
  /** 수정 아이콘을 눌렀을 때 */
  onEdit?: (id: string) => void;
  /** 삭제 아이콘을 눌렀을 때 */
  onDelete?: (id: string) => void;
  /** `자료추가`를 눌렀을 때 */
  onAddPress?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function ResourceSection({
  items,
  onEdit,
  onDelete,
  onAddPress,
  className,
}: ResourceSectionProps) {
  return (
    <View className={cn("gap-4", className)}>
      <Text className="text-gray-900 text-b-02-m">자료 모음집</Text>
      <View className="gap-4">
        <View className="gap-3">
          {items.map((item) => (
            <ResourceItem
              key={item.id}
              title={item.title}
              link={item.link}
              onEdit={() => onEdit?.(item.id)}
              onDelete={() => onDelete?.(item.id)}
            />
          ))}
        </View>
        <Pressable
          accessibilityRole={onAddPress ? "button" : undefined}
          onPress={onAddPress}
          className="h-10 flex-row items-center gap-1 rounded-lg bg-gray-0 p-2"
        >
          <Add variant="sm" className="text-gray-600" />
          <Text className="text-gray-600 text-b-04-m">자료추가</Text>
        </Pressable>
      </View>
    </View>
  );
}
