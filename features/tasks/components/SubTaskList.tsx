import { type ReactNode, useState } from "react";
import { Pressable, Text, View, type ViewStyle } from "react-native";

import { ExpandButton } from "@/components/common/ExpandButton/ExpandButton";
import { Add } from "@/components/icons";
import { CARD_SHADOW } from "@/constants/shadows";
import type { DueDate } from "@/lib/dueDate";
import { cn } from "@/lib/utils";

import { type SubTask, SubTaskRow } from "./SubTaskRow";

export type SubTaskListProps = {
  /** 세부 TASK 목록 */
  items: readonly SubTask[];
  /** 체크박스를 눌렀을 때 */
  onToggle?: (id: string) => void;
  /** 알림 아이콘을 눌렀을 때 */
  onAlarmPress?: (id: string) => void;
  /** 날짜 피커에서 `저장`을 눌렀을 때. 넘기면 달력 아이콘과 날짜를 눌러 마감일을 바꿀 수 있다. */
  onDueDateChange?: (id: string, value: DueDate | null) => void;
  /** 날짜 피커에서 이 마감일보다 늦게 고를 수 없다 (과제 마감일) */
  maxDate?: DueDate | null;
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
  onDueDateChange,
  maxDate,
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
      <Text className="text-gray-900 text-b-02-m">세부 TASK</Text>

      <View style={cardShadow} className="gap-4 rounded-xl bg-bg px-3 py-4">
        {/* 비어 있을 때 빈 목록 View 가 gap 을 한 번 더 먹어 `세부과제 추가`가 내려가므로, 목록 대신 안내 문구를 둔다 */}
        {items.length === 0 ? (
          <Text className="text-gray-400 text-b-04-r">
            등록된 TASK가 없습니다.
          </Text>
        ) : (
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
                    onDueDateChange={
                      onDueDateChange
                        ? (value) => onDueDateChange(item.id, value)
                        : undefined
                    }
                    deadline={item.deadline}
                    maxDate={maxDate}
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
        )}

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
