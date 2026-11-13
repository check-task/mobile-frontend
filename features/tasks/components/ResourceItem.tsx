import { Pressable, Text, View } from "react-native";

import { Cancel, Pencil } from "@/components/icons";
import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

export type ResourceItemProps = {
  /** 자료 이름 (예: `자료명`) */
  title: string;
  /** 밑줄로 보여 줄 경로 또는 파일명 (예: `경로`) */
  link: string;
  /** 수정 아이콘을 눌렀을 때. 넘기지 않으면 수정 아이콘을 그리지 않는다. */
  onEdit?: () => void;
  /** 삭제 아이콘을 눌렀을 때. 넘기지 않으면 삭제 아이콘을 그리지 않는다. */
  onDelete?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

/**
 * 자료 모음집·회의록·커뮤니케이션 목록에서 쓰는 항목 카드. Figma `(mobile) 자료`(358×68).
 * 우상단 아이콘이 카드 높이를 키우지 않도록 절대 위치로 겹쳐 둔다.
 */
export function ResourceItem({
  title,
  link,
  onEdit,
  onDelete,
  className,
}: ResourceItemProps) {
  const hasActions = onEdit !== undefined || onDelete !== undefined;

  return (
    <View
      style={CARD_SHADOW}
      className={cn("gap-2 rounded-lg bg-blue-50 p-3", className)}
    >
      {hasActions ? (
        <View className="absolute right-3 top-[11px] flex-row gap-2">
          {onEdit ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="수정"
              onPress={onEdit}
              hitSlop={8}
            >
              <Pencil className="text-gray-600" />
            </Pressable>
          ) : null}
          {onDelete ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="삭제"
              onPress={onDelete}
              hitSlop={8}
            >
              <Cancel className="text-gray-600" />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <Text
        numberOfLines={1}
        className={cn("text-gray-600 text-b-04-m", hasActions ? "pr-12" : "")}
      >
        {title}
      </Text>
      <Text numberOfLines={1} className="text-gray-600 underline text-b-04-r">
        {link}
      </Text>
    </View>
  );
}
