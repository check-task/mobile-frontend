import { useState } from "react";

import { FolderReorderRow } from "./FolderReorderRow";
import type { SettingsFolder } from "./settingsData";

// 폴더 행 높이(구분선 1 + 위아래 12 + 아이콘 24). 드래그 시 몇 칸 움직였는지 계산에 쓴다
const ROW_HEIGHT = 49;

type FolderReorderListProps = {
  folders: SettingsFolder[];
  onChange: (folders: SettingsFolder[]) => void;
  onHoldChange: (holding: boolean) => void;
};

export function FolderReorderList({
  folders,
  onChange,
  onHoldChange,
}: FolderReorderListProps) {
  const [drag, setDrag] = useState<{ index: number; dy: number } | null>(null);
  const targetOf = (index: number, dy: number) =>
    clamp(index + Math.round(dy / ROW_HEIGHT), 0, folders.length - 1);

  // 끌고 있는 행은 손가락을 따라가고, 그 사이 행은 한 칸씩 밀려난다
  const offsetOf = (index: number) => {
    if (!drag) return 0;
    if (index === drag.index) return drag.dy;
    const target = targetOf(drag.index, drag.dy);
    if (drag.index < index && index <= target) return -ROW_HEIGHT;
    if (target <= index && index < drag.index) return ROW_HEIGHT;
    return 0;
  };

  return folders.map((folder, index) => (
    <FolderReorderRow
      key={folder.id}
      folder={folder}
      offsetY={offsetOf(index)}
      isDragging={drag?.index === index}
      onDragStart={() => setDrag({ index, dy: 0 })}
      onDragMove={(dy) => setDrag({ index, dy })}
      onDragEnd={(dy) => {
        onChange(moveItem(folders, index, targetOf(index, dy)));
        setDrag(null);
      }}
      onHoldChange={onHoldChange}
    />
  ));
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function moveItem<T>(items: readonly T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}
