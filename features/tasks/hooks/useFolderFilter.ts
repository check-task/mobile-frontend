import { useState } from "react";

type FolderLike = { id: string };

// 폴더 다중 선택. 전부 선택된 상태 = "모든 과제"
// 폴더 목록이 API 로 늦게 와도 처음엔 전체 선택이 되도록 null 을 "전체" 로 둔다
export function useFolderFilter<T extends FolderLike>(folders: readonly T[]) {
  const [picked, setPicked] = useState<ReadonlySet<string> | null>(null);

  const allIds = () => new Set(folders.map((folder) => folder.id));
  const selectedIds = picked ?? allIds();
  const isAllSelected = folders.every((folder) => selectedIds.has(folder.id));
  // 버튼 라벨은 선택된 폴더 중 맨 위 폴더 기준
  const firstSelected = folders.find((folder) => selectedIds.has(folder.id));

  const selectAll = () => setPicked(null);

  // 연속으로 빠르게 눌러도 선택 안 빠지게 prev 기준으로 업데이트
  const toggleFolder = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev ?? allIds());
      if (next.has(id)) next.delete(id);
      else next.add(id);
      // 다 해제하거나 다 고르면 전체 선택으로
      const isAll = folders.every((folder) => next.has(folder.id));
      return next.size === 0 || isAll ? null : next;
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
