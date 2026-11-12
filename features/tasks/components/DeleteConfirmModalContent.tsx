import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { cn } from "@/lib/utils";

type DeleteConfirmQuestion =
  | { heading: string; targetName?: never }
  | { targetName: string; heading?: never };

export type DeleteConfirmModalContentProps = DeleteConfirmQuestion & {
  /** 보조 설명 (예: `삭제된 과제는 영구 삭제되며, 복구할 수 없습니다.`) */
  description: string;
  /** 확인 버튼 문구. (기본값: `삭제`) */
  confirmLabel?: string;
  /** `true`면 `취소`가 확인 버튼 위에 놓인다. (기본값: `false`) */
  cancelFirst?: boolean;
  /** 확인 버튼을 눌렀을 때 */
  onConfirm: () => void;
  /** `취소`를 눌렀을 때 */
  onCancel: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function DeleteConfirmModalContent({
  heading,
  targetName,
  description,
  confirmLabel = "삭제",
  cancelFirst = false,
  onConfirm,
  onCancel,
  className,
}: DeleteConfirmModalContentProps) {
  const confirmButton = (
    <Button
      label={confirmLabel}
      variant="blue"
      size="modal"
      onPress={onConfirm}
    />
  );
  const cancelButton = (
    <Button label="취소" variant="gray" size="modal" onPress={onCancel} />
  );

  return (
    <View
      className={cn(
        "pb-6 pt-5",
        targetName !== undefined ? "gap-[21px]" : "gap-6",
        className
      )}
    >
      <View className="gap-2">
        {targetName !== undefined ? (
          <View className="flex-row flex-wrap items-center gap-1">
            <Text className="text-primary text-b-01-m">{targetName}</Text>
            <Text className="text-gray-800 text-b-02-m">
              을(를) 삭제하시겠습니까?
            </Text>
          </View>
        ) : (
          <Text className="text-gray-800 text-b-02-m">{heading}</Text>
        )}
        <Text className="text-gray-600 text-b-04-r">{description}</Text>
      </View>
      <View className="gap-3">
        {cancelFirst ? cancelButton : confirmButton}
        {cancelFirst ? confirmButton : cancelButton}
      </View>
    </View>
  );
}
