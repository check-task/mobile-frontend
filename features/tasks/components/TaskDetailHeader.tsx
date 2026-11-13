import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { FolderColorDot } from "@/components/common/FolderColorDot/FolderColorDot";
import { cn } from "@/lib/utils";
import type { FolderColor } from "@/types/folder.types";

import { CompletionRate } from "./CompletionRate";

export type TaskDetailHeaderProps = {
  /** 과제가 속한 폴더 색상 */
  folderColor: FolderColor;
  /** 마감까지 남은 기간 라벨 (예: `D-3`). 포맷은 호출부가 정한다. */
  dday: string;
  /** 과제 이름 */
  title: string;
  /** 완료율(0~100) */
  percent: number;
  /** `과제수정`을 눌렀을 때 */
  onEditPress?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function TaskDetailHeader({
  folderColor,
  dday,
  title,
  percent,
  onEditPress,
  className,
}: TaskDetailHeaderProps) {
  return (
    <View className={cn("gap-3", className)}>
      <View className="flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center gap-2">
          <FolderColorDot color={folderColor} size="md" />
          <View className="flex-1 gap-1">
            <Text className="text-sub-01 text-b-03-m">{dday}</Text>
            <Text numberOfLines={1} className="text-gray-900 text-b-01-m">
              {title}
            </Text>
          </View>
        </View>
        <Button
          label="과제수정"
          variant="gray"
          size="sm"
          onPress={onEditPress}
        />
      </View>
      <CompletionRate percent={percent} className="pl-8" />
    </View>
  );
}
