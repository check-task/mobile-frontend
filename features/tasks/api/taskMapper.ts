import type { FolderColor } from "@/types/folder.types";

import type { MyFolder } from "./task.types";

// 디자인 토큰(constants/theme-vars.ts 라이트 값)과 hex 가 같을 때만 매핑한다.
const FOLDER_COLOR_BY_HEX: Record<string, FolderColor> = {
  "#F55757": "sub-01",
  "#FFC93F": "sub-02",
  "#6EC77B": "sub-03",
  "#A177E2": "sub-04",
  "#081221": "sub-05",
};

export function toFolderColor(hex: string): FolderColor {
  return FOLDER_COLOR_BY_HEX[hex.toUpperCase()] ?? "sub-null";
}

export function toFolderOptions(folders: MyFolder[]) {
  return folders.map((folder) => ({
    folderId: folder.folderId,
    folderTitle: folder.folderTitle,
    color: toFolderColor(folder.color),
  }));
}
