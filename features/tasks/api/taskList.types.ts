import type { FolderColor } from "@/types/folder.types";

export type TaskScope = "personal" | "team";

export type TaskFolder = {
  id: string;
  name: string;
  color: FolderColor;
};

/** 내 과제·완료 과제 목록 카드 하나 */
export type TaskListItem = {
  id: string;
  /** 폴더가 없으면 null (모든 과제를 볼 때만 보인다) */
  folderId: string | null;
  folderName: string;
  folderColor: FolderColor;
  title: string;
  scope: TaskScope;
  // 진행 중이면 dday, 완료면 completedDate 사용
  dday: string;
  completedDate: string;
};
