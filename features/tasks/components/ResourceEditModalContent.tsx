import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { cn } from "@/lib/utils";

export type ResourceEditModalContentProps = {
  /** 입력 중인 이름 */
  fileName: string;
  /** 이름이 바뀔 때 */
  onChangeFileName: (text: string) => void;
  /** 입력 중인 경로 */
  filePath: string;
  /** 경로가 바뀔 때 */
  onChangeFilePath: (text: string) => void;
  /** `저장`을 눌렀을 때 */
  onSave: () => void;
  /** 이름 입력의 라벨. (기본값: `파일명`) */
  nameLabel?: string;
  /** 이름 입력의 플레이스홀더. (기본값: `파일명을 입력하세요.`) */
  namePlaceholder?: string;
  /** 경로 입력의 라벨. (기본값: `파일경로`) */
  pathLabel?: string;
  /** 경로 입력의 플레이스홀더. (기본값: `파일을 선택하세요`) */
  pathPlaceholder?: string;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function ResourceEditModalContent({
  fileName,
  onChangeFileName,
  filePath,
  onChangeFilePath,
  onSave,
  nameLabel = "파일명",
  namePlaceholder = "파일명을 입력하세요.",
  pathLabel = "파일경로",
  pathPlaceholder = "파일을 선택하세요",
  className,
}: ResourceEditModalContentProps) {
  return (
    <View className={cn("gap-6 py-5", className)}>
      <View className="gap-3">
        <View className="gap-3">
          <Text className="text-gray-900 text-b-02-r">{nameLabel}</Text>
          <Input
            shape="modal"
            value={fileName}
            onChangeText={onChangeFileName}
            placeholder={namePlaceholder}
          />
        </View>
        <View className="gap-3">
          <Text className="text-gray-900 text-b-02-r">{pathLabel}</Text>
          <Input
            shape="modal"
            value={filePath}
            onChangeText={onChangeFilePath}
            placeholder={pathPlaceholder}
          />
        </View>
      </View>
      <Button label="저장" variant="blue" size="modal" onPress={onSave} />
    </View>
  );
}
