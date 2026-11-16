import { Pressable, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { Cancel } from "@/components/icons";

import { AddItemButton } from "./AddItemButton";
import type { DueDate } from "@/lib/dueDate";

import type { SubTaskDraft } from "../api/taskForm.types";

import { DueDateField } from "./DueDateField";
import { TaskFormField } from "./TaskFormField";

export type TaskSubTaskSectionProps = {
  subTasks: readonly SubTaskDraft[];
  /** 세부 과제 마감일 상한 (과제 마감일) */
  deadline: DueDate | null;
  onChange: (id: string, patch: Partial<SubTaskDraft>) => void;
  onRemove: (subTask: SubTaskDraft) => void;
  onAdd: () => void;
  /** 있으면 라벨 옆에 `전체삭제` 버튼을 보여 준다 */
  onRemoveAll?: () => void;
};

export function TaskSubTaskSection({
  subTasks,
  deadline,
  onChange,
  onRemove,
  onAdd,
  onRemoveAll,
}: TaskSubTaskSectionProps) {
  return (
    <TaskFormField
      label="TASK"
      action={
        onRemoveAll && subTasks.length > 0 ? (
          <Button
            label="전체삭제"
            variant="gray"
            size="sm"
            className="h-6 w-auto px-2 py-0"
            onPress={onRemoveAll}
          />
        ) : null
      }
    >
      {subTasks.length > 0 ? (
        <View className="gap-2">
          {subTasks.map((subTask) => (
            <View key={subTask.id} className="flex-row items-center gap-1">
              <View className="flex-1 flex-row items-center gap-2">
                <Input
                  shape="line"
                  value={subTask.title}
                  onChangeText={(title) => onChange(subTask.id, { title })}
                  placeholder="과제명을 입력하세요."
                  className="flex-1"
                />
                {/* 날짜 글자 폭과 관계없이 X 위치를 맞추려고 Figma 폭(아이콘 24 + 간격 4 + 날짜 54)으로 고정 */}
                <View className="w-[82px]">
                  <DueDateField
                    value={subTask.dueDate}
                    onChange={(dueDate) => onChange(subTask.id, { dueDate })}
                    allowNoDate
                    maxDate={deadline}
                  />
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="TASK 삭제"
                hitSlop={8}
                onPress={() => onRemove(subTask)}
              >
                <Cancel className="text-gray-600" />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
      <AddItemButton label="TASK 추가" onPress={onAdd} />
    </TaskFormField>
  );
}
