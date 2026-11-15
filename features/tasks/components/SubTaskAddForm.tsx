import { Pressable, Text, View } from "react-native";

import { Input } from "@/components/common/Input/Input";
import { Cancel, Check } from "@/components/icons";
import { cn } from "@/lib/utils";

import type { DueDate } from "@/lib/dueDate";

import { DueDateField } from "./DueDateField";

export type SubTaskAddFormProps = {
  /** 입력 중인 세부 TASK 이름 */
  title: string;
  /** 이름이 바뀔 때 */
  onChangeTitle: (title: string) => void;
  /** 선택한 마감일. `null`이면 미지정 */
  dueDate: DueDate | null;
  /** 마감일을 고를 때 */
  onChangeDueDate: (dueDate: DueDate | null) => void;
  /** 이 마감일보다 늦게 고를 수 없다 (과제 마감일) */
  maxDate?: DueDate | null;
  /** `취소`를 눌렀을 때 */
  onCancel: () => void;
  /** `저장`을 눌렀을 때 */
  onSave: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function SubTaskAddForm({
  title,
  onChangeTitle,
  dueDate,
  onChangeDueDate,
  maxDate,
  onCancel,
  onSave,
  className,
}: SubTaskAddFormProps) {
  return (
    <View className={cn("gap-3", className)}>
      <View className="flex-row items-center gap-2">
        <Input
          shape="line"
          value={title}
          onChangeText={onChangeTitle}
          placeholder="과제명을 입력하세요"
          className="w-[244px]"
        />
        <View className="flex-1">
          <DueDateField
            value={dueDate}
            onChange={onChangeDueDate}
            allowNoDate
            maxDate={maxDate}
            placeholder="미지정"
            size="sm"
          />
        </View>
      </View>

      <View className="flex-row gap-2 self-start">
        <Pressable
          accessibilityRole="button"
          onPress={onCancel}
          className="flex-row items-center gap-1 rounded-full border border-gray-400 py-[3px] pl-[3px] pr-[7px]"
        >
          <Cancel variant="sm" className="text-gray-400" />
          <Text className="text-gray-400 text-b-04-r">취소</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onSave}
          className="flex-row items-center gap-1 rounded-full border border-blue-500 py-[3px] pl-[3px] pr-[7px]"
        >
          <Check variant="sm" className="text-blue-500" />
          <Text className="text-blue-500 text-b-04-r">저장</Text>
        </Pressable>
      </View>
    </View>
  );
}
