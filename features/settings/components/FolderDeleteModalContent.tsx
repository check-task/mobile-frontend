import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { FolderColorDot } from "@/components/common/FolderColorDot/FolderColorDot";
import { FOLDER_TEXT_CLASS } from "@/constants/folderColorClass";
import { cn } from "@/lib/utils";

import type { SettingsFolder } from "./settingsData";

type FolderDeleteModalContentProps = {
  folder: SettingsFolder;
  onConfirm: () => void;
  onCancel: () => void;
};

export function FolderDeleteModalContent({
  folder,
  onConfirm,
  onCancel,
}: FolderDeleteModalContentProps) {
  return (
    <View className="gap-6 pb-6 pt-5">
      <View className="gap-2">
        <View className="flex-row flex-wrap items-center gap-1">
          <Text className="text-gray-800 text-b-02-m">폴더명</Text>
          <View className="flex-row items-center gap-0.5">
            <FolderColorDot color={folder.color} className="h-5 w-5" />
            <Text
              className={cn(FOLDER_TEXT_CLASS[folder.color], "text-b-01-m")}
            >
              {folder.name}
            </Text>
          </View>
          <Text className="text-gray-800 text-b-02-m">
            을(를) 삭제하시겠습니까?
          </Text>
        </View>
        <View className="flex-row flex-wrap items-center gap-x-2 gap-y-0.5">
          <Text className="text-gray-600 text-b-04-r">
            삭제된 폴더는 복구할 수 없으며, 폴더 내부에 존재하는 과제는
          </Text>
          <View className="flex-row items-center gap-1">
            <View className="flex-row items-center gap-0.5 rounded-sm bg-gray-100 px-1 py-0.5">
              <FolderColorDot color="sub-null" />
              <Text className="text-sub-null text-b-04-m">지정안함</Text>
            </View>
            <Text className="text-gray-600 text-b-04-r">
              폴더로 이동됩니다.
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-3">
        <Button label="취소" variant="gray" size="modal" onPress={onCancel} />
        <Button label="삭제" variant="blue" size="modal" onPress={onConfirm} />
      </View>
    </View>
  );
}
