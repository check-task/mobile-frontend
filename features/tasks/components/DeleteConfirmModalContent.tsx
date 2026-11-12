import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { cn } from "@/lib/utils";

export type DeleteConfirmModalContentProps = {
  /** 확인 질문 (예: `모든 세부과제를 삭제하시겠습니까?`) */
  heading: string;
  /** 보조 설명 (예: `삭제된 과제는 영구 삭제되며, 복구할 수 없습니다.`) */
  description: string;
  /** 확인 버튼 문구. (기본값: `삭제`) */
  confirmLabel?: string;
  /** 확인 버튼을 눌렀을 때 */
  onConfirm: () => void;
  /** `취소`를 눌렀을 때 */
  onCancel: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function DeleteConfirmModalContent({
  heading,
  description,
  confirmLabel = "삭제",
  onConfirm,
  onCancel,
  className,
}: DeleteConfirmModalContentProps) {
  return (
    <View className={cn("gap-6 py-5", className)}>
      <View className="gap-2">
        <Text className="text-gray-900 text-b-02-m">{heading}</Text>
        <Text className="text-gray-600 text-b-04-r">{description}</Text>
      </View>
      <View className="gap-3">
        <Button
          label={confirmLabel}
          variant="blue"
          size="modal"
          onPress={onConfirm}
        />
        <Button label="취소" variant="gray" size="modal" onPress={onCancel} />
      </View>
    </View>
  );
}
