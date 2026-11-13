import { type ReactNode, useState } from "react";
import { Pressable, Text, View, type ViewStyle } from "react-native";

import { ExpandButton } from "@/components/common/ExpandButton/ExpandButton";
import { Add, Pencil } from "@/components/icons";
import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

import { type SubTask, SubTaskRow } from "./SubTaskRow";

export type SubTaskListProps = {
  /** 세부 TASK 목록 */
  items: readonly SubTask[];
  /** 체크박스를 눌렀을 때 */
  onToggle?: (id: string) => void;
  /** 알림 아이콘을 눌렀을 때 */
  onAlarmPress?: (id: string) => void;
  /** 제목 옆 연필 아이콘을 눌렀을 때 */
  onEditPress?: () => void;
  /** `세부과제 추가`를 눌렀을 때 */
  onAddPress?: () => void;
  /** 넘기면 `세부과제 추가` 줄 대신 이 입력 폼을 보여 준다. */
  addForm?: ReactNode;
  /** 처음에 보여 줄 개수. 넘기면 초과분은 `펼쳐보기`를 누를 때까지 숨긴다. */
  collapsedCount?: number;
  /** 카드 그림자. (기본값: 일반 카드 그림자) */
  cardShadow?: ViewStyle;
  /** 펼쳐진 세부 TASK의 id 목록 */
  expandedIds?: readonly string[];
  /** 행의 펼침 화살표를 눌렀을 때. 넘기면 화살표를 그린다. */
  onExpandPress?: (id: string) => void;
  /** 펼쳐진 행 아래에 그릴 내용 */
  renderExpanded?: (item: SubTask) => ReactNode;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function SubTaskList({
  items,
  onToggle,
  onAlarmPress,
  onEditPress,
  onAddPress,
  addForm,
  collapsedCount,
  cardShadow = CARD_SHADOW,
  expandedIds,
  onExpandPress,
  renderExpanded,
  className,
}: SubTaskListProps) {
  const [expanded, setExpanded] = useState(false);
  const isCollapsed =
    collapsedCount !== undefined && !expanded && items.length > collapsedCount;
  const visibleItems = isCollapsed ? items.slice(0, collapsedCount) : items;

  // 추가 중이거나 추가한 항목이 숨겨지지 않도록 펼친다. 한 번 펼친 상태는 폼을 닫아도 유지된다.
  const handleAddPress = () => {
    setExpanded(true);
    onAddPress?.();
  };

  return (
    <View className={cn("gap-4", className)}>
      <View className="flex-row items-center gap-1">
        <Text className="text-gray-900 text-b-02-m">세부 TASK</Text>
        <Pressable
          accessibilityRole={onEditPress ? "button" : undefined}
          accessibilityLabel="세부 TASK 수정"
          hitSlop={8}
          onPress={onEditPress}
        >
          <Pencil className="text-gray-900" />
        </Pressable>
      </View>

      <View style={cardShadow} className="gap-4 rounded-xl bg-bg px-3 py-4">
        <View className="gap-4">
          {visibleItems.map((item) => {
            const isExpanded = expandedIds?.includes(item.id) ?? false;

            return (
              <View key={item.id} className="gap-3">
                <SubTaskRow
                  title={item.title}
                  dueDate={item.dueDate}
                  done={item.done}
                  alarm={item.alarm}
                  onToggle={onToggle ? () => onToggle(item.id) : undefined}
                  onAlarmPress={
                    onAlarmPress ? () => onAlarmPress(item.id) : undefined
                  }
                  expanded={isExpanded}
                  onExpandPress={
                    onExpandPress ? () => onExpandPress(item.id) : undefined
                  }
                />
                {isExpanded && renderExpanded ? renderExpanded(item) : null}
              </View>
            );
          })}
        </View>

        {isCollapsed ? (
          <ExpandButton onPress={() => setExpanded(true)} />
        ) : null}

        {addForm ?? (
          <Pressable
            accessibilityRole={onAddPress ? "button" : undefined}
            onPress={handleAddPress}
            className="flex-row items-center gap-1"
          >
            <Add variant="sm" className="text-gray-500" />
            <Text className="text-gray-500 text-b-04-r">세부과제 추가</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
