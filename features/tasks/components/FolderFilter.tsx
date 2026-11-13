import { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ViewInstance,
} from "react-native";

import { FolderColorDot } from "@/components/common/FolderColorDot/FolderColorDot";
import { FolderFilterItem } from "@/components/common/FolderFilterItem/FolderFilterItem";
import { Filter, Task } from "@/components/icons";
import { CARD_SHADOW, DROPDOWN_SHADOW } from "@/constants/shadows";

import type { TaskFolder } from "./taskListData";

// 필터 버튼과 드롭다운 사이 간격
const DROPDOWN_GAP = 4;

type DropdownPosition = { top: number; right: number };

type FolderFilterProps = {
  folders: readonly TaskFolder[];
  selectedIds: ReadonlySet<string>;
  isAllSelected: boolean;
  firstSelected: TaskFolder | undefined;
  selectedCount: number;
  onSelectAll: () => void;
  onToggleFolder: (id: string) => void;
};

export function FolderFilter({
  folders,
  selectedIds,
  isAllSelected,
  firstSelected,
  selectedCount,
  onSelectAll,
  onToggleFolder,
}: FolderFilterProps) {
  const buttonRef = useRef<ViewInstance>(null);
  const { width: windowWidth } = useWindowDimensions();
  const [position, setPosition] = useState<DropdownPosition | null>(null);

  // 버튼 오른쪽 끝에 맞춰서 드롭다운 위치 계산
  const open = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height + DROPDOWN_GAP,
        right: windowWidth - (x + width),
      });
    });
  };
  const close = () => setPosition(null);

  const label = isAllSelected
    ? "모든 과제"
    : `${firstSelected?.name ?? ""}${selectedCount > 1 ? " 외" : ""}`;

  return (
    <>
      <Pressable
        ref={buttonRef}
        accessibilityRole="button"
        accessibilityLabel={`폴더 필터: ${label}`}
        accessibilityState={{ expanded: position !== null }}
        onPress={position ? close : open}
        style={CARD_SHADOW}
        className="flex-row items-center gap-1 rounded-full bg-gray-0 py-1 pl-2 pr-1"
      >
        <View className="flex-row items-center gap-0.5">
          {isAllSelected ? (
            <Task variant="sm" className="text-gray-800" />
          ) : (
            <FolderColorDot color={firstSelected?.color} size="xs" />
          )}
          <Text className="text-gray-800 text-b-04-r">{label}</Text>
        </View>
        <Filter variant="md" className="text-gray-800" />
      </Pressable>

      <Modal
        visible={position !== null}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={close}
      >
        <Pressable
          accessibilityLabel="폴더 필터 닫기"
          onPress={close}
          className="flex-1"
        >
          {position ? (
            // overflow-hidden이랑 그림자를 같이 두면 iOS에서 그림자가 잘려서 View를 나눔
            <View
              style={[DROPDOWN_SHADOW, position]}
              className="absolute w-[106px] rounded-xl bg-gray-0"
            >
              <View className="overflow-hidden rounded-xl border border-gray-100">
                <FolderFilterItem
                  type="all"
                  selected={isAllSelected}
                  onPress={onSelectAll}
                />
                {folders.map((folder) => (
                  <FolderFilterItem
                    key={folder.id}
                    type="folder"
                    name={folder.name}
                    color={folder.color}
                    selected={selectedIds.has(folder.id)}
                    onPress={() => onToggleFolder(folder.id)}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </Pressable>
      </Modal>
    </>
  );
}
