import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { cn } from "@/lib/utils";

export type ResourceEditModalContentProps = {
  /** 입력 중인 파일명 */
  fileName: string;
  /** 파일명이 바뀔 때 */
  onChangeFileName: (text: string) => void;
  /** 입력 중인 파일 경로 */
  filePath: string;
  /** 파일 경로가 바뀔 때 */
  onChangeFilePath: (text: string) => void;
  /** `저장`을 눌렀을 때 */
  onSave: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function ResourceEditModalContent({
  fileName,
  onChangeFileName,
  filePath,
  onChangeFilePath,
  onSave,
  className,
}: ResourceEditModalContentProps) {
  return (
    <View className={cn("gap-6 py-5", className)}>
      <View className="gap-3">
        <View className="gap-3">
          <Text className="text-gray-900 text-b-02-m">파일명</Text>
          <Input
            shape="modal"
            value={fileName}
            onChangeText={onChangeFileName}
            placeholder="파일명을 입력하세요."
          />
        </View>
        <View className="gap-3">
          <Text className="text-gray-900 text-b-02-m">파일경로</Text>
          <Input
            shape="modal"
            value={filePath}
            onChangeText={onChangeFilePath}
            placeholder="파일을 선택하세요"
          />
        </View>
      </View>
      <Button label="저장" variant="blue" size="modal" onPress={onSave} />
    </View>
  );
}
