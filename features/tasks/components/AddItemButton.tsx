import { Pressable, Text } from "react-native";

import { Add } from "@/components/icons";

export type AddItemButtonProps = {
  /** 버튼 문구 (예: `TASK 추가`) */
  label: string;
  onPress: () => void;
};

/** 과제 등록 화면·자료 추가 모달의 테두리 있는 `+ 추가` 버튼. Figma `(mobile) btn`(h40). */
export function AddItemButton({ label, onPress }: AddItemButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-10 w-full flex-row items-center gap-1 rounded-lg border border-gray-100 bg-gray-0 px-3"
    >
      <Add variant="sm" className="text-gray-600" />
      <Text className="text-gray-600 text-b-04-m">{label}</Text>
    </Pressable>
  );
}
