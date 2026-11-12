import { Pressable, Text, View } from "react-native";

import { Input } from "@/components/common/Input/Input";
import { Calendar, Cancel, Check } from "@/components/icons";
import { cn } from "@/lib/utils";

export type SubTaskAddFormProps = {
  /** 입력 중인 세부 TASK 이름 */
  title: string;
  /** 이름이 바뀔 때 */
  onChangeTitle: (title: string) => void;
  /** 마감일 라벨 (예: `25.10.19`). 포맷은 호출부가 정한다. */
  dueDate: string;
  /** 마감일을 눌렀을 때 */
  onDatePress?: () => void;
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
  onDatePress,
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
        <Pressable
          accessibilityRole={onDatePress ? "button" : undefined}
          accessibilityLabel="마감일 선택"
          onPress={onDatePress}
          className="flex-1 flex-row items-center gap-1"
        >
          <Calendar variant="lg" className="text-gray-600" />
          <Text className="text-gray-600 text-b-04-r">{dueDate}</Text>
        </Pressable>
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
