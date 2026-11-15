import type { ReactNode } from "react";
import { Text, View } from "react-native";

export type TaskFormFieldProps = {
  label: string;
  /** 라벨 오른쪽에 둘 버튼 (예: `전체삭제`) */
  action?: ReactNode;
  children: ReactNode;
};

/** 과제 등록·수정 폼의 라벨 + 입력 영역 */
export function TaskFormField({ label, action, children }: TaskFormFieldProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-900 text-b-02-r">{label}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}
