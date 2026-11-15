// API 작업 전까지 임시로 사용할 더미 데이터
// TODO(api): GET /api/v1/user/me → folders[]{folderId, folderTitle, color(hex)}
import type { FolderColor } from "@/types/folder.types";

export type FolderOption = {
  folderId: number;
  folderTitle: string;
  color: FolderColor;
};

export const FOLDER_OPTIONS: readonly FolderOption[] = [
  { folderId: 1, folderTitle: "전공", color: "sub-01" },
  { folderId: 2, folderTitle: "교양", color: "sub-02" },
  { folderId: 3, folderTitle: "동아리", color: "sub-03" },
  { folderId: 4, folderTitle: "대외활동", color: "sub-04" },
  { folderId: 5, folderTitle: "기타", color: "sub-05" },
];
