import { useState } from "react";

type FolderLike = { id: string };

// 폴더 다중 선택. 전부 선택된 상태 = "모든 과제"
export function useFolderFilter<T extends FolderLike>(folders: readonly T[]) {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
    () => new Set(folders.map((folder) => folder.id))
  );

  const isAllSelected = folders.every((folder) => selectedIds.has(folder.id));
  // 버튼 라벨은 선택된 폴더 중 맨 위 폴더 기준
  const firstSelected = folders.find((folder) => selectedIds.has(folder.id));

  const selectAll = () => {
    setSelectedIds(new Set(folders.map((folder) => folder.id)));
  };

  // 연속으로 빠르게 눌러도 선택 안 빠지게 prev 기준으로 업데이트
  const toggleFolder = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      // 다 해제하면 빈 목록 말고 전체 선택으로
      return next.size === 0
        ? new Set(folders.map((folder) => folder.id))
        : next;
    });
  };

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isAllSelected,
    firstSelected,
    selectAll,
    toggleFolder,
  };
}
