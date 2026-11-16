import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { FolderColorDot } from "@/components/common/FolderColorDot/FolderColorDot";
import { Cancel, Check, Pencil } from "@/components/icons";
import { MAX_FOLDER_COUNT } from "@/constants/settings";
import { cn } from "@/lib/utils";

import { FolderReorderList } from "./FolderReorderList";
import type { SettingsFolder } from "./settingsData";
import { SettingsCard } from "./SettingsCard";

type FolderSettingsCardProps = {
  folders: SettingsFolder[];
  reordering: boolean;
  onAdd: () => void;
  onEdit: (folder: SettingsFolder) => void;
  onDelete: (folder: SettingsFolder) => void;
  onReorderStart: () => void;
  onReorderCancel: () => void;
  onReorderSave: (folders: SettingsFolder[]) => void;
  onHandleHoldChange: (holding: boolean) => void;
};

export function FolderSettingsCard({
  folders,
  reordering,
  onAdd,
  onEdit,
  onDelete,
  onReorderStart,
  onReorderCancel,
  onReorderSave,
  onHandleHoldChange,
}: FolderSettingsCardProps) {
  const [draft, setDraft] = useState(folders);
  const canAdd = folders.length < MAX_FOLDER_COUNT;

  return (
    <SettingsCard className="gap-5 pb-2">
      <View className="flex-row items-start justify-between">
        <Text className="text-gray-900 text-b-01-m">
          {reordering ? "폴더 순서 변경" : "폴더 설정"}
        </Text>
        {reordering ? (
          <View className="flex-row gap-2">
            <PillButton
              label="취소"
              icon={<Cancel variant="sm" className="text-gray-400" />}
              className="border-gray-400"
              textClassName="text-gray-400"
              onPress={onReorderCancel}
            />
            <PillButton
              label="저장"
              icon={<Check variant="sm" className="text-blue-500" />}
              className="border-blue-500"
              textClassName="text-blue-500"
              onPress={() => onReorderSave(draft)}
            />
          </View>
        ) : (
          <View className="flex-row gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canAdd }}
              disabled={!canAdd}
              onPress={onAdd}
              className={cn(
                "h-6 justify-center rounded px-2",
                canAdd ? "bg-blue-50" : "bg-gray-100"
              )}
            >
              <Text
                className={cn(
                  "text-b-04-m",
                  canAdd ? "text-primary" : "text-gray-400"
                )}
              >
                폴더추가
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setDraft(folders);
                onReorderStart();
              }}
              className="h-6 justify-center rounded bg-bg px-2"
            >
              <Text className="text-blue-600 text-b-04-m">순서변경</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View>
        <View className="flex-row items-center gap-2 pb-3">
          <FolderColorDot color="sub-null" className="h-5 w-5" />
          <Text className="text-gray-700 text-b-02-m">지정안함</Text>
        </View>
        {reordering ? (
          <FolderReorderList
            folders={draft}
            onChange={setDraft}
            onHoldChange={onHandleHoldChange}
          />
        ) : (
          folders.map((folder) => (
            <View
              key={folder.id}
              className="h-[49px] flex-row items-center justify-between border-t border-gray-100"
            >
              <View className="flex-row items-center gap-2">
                <FolderColorDot color={folder.color} className="h-5 w-5" />
                <Text className="text-gray-700 text-b-02-m">{folder.name}</Text>
              </View>
              <View className="flex-row gap-1">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${folder.name} 폴더 수정`}
                  hitSlop={4}
                  onPress={() => onEdit(folder)}
                >
                  <Pencil variant="lg" className="text-gray-700" />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${folder.name} 폴더 삭제`}
                  hitSlop={4}
                  onPress={() => onDelete(folder)}
                >
                  <Cancel variant="lg" className="text-gray-700" />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </SettingsCard>
  );
}

type PillButtonProps = {
  label: string;
  icon: ReactNode;
  className: string;
  textClassName: string;
  onPress: () => void;
};

function PillButton({
  label,
  icon,
  className,
  textClassName,
  onPress,
}: PillButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-1 rounded-full border py-1 pl-1 pr-2",
        className
      )}
    >
      {icon}
      <Text className={cn("text-b-04-r", textClassName)}>{label}</Text>
    </Pressable>
  );
}
