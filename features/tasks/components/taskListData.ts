import type { FolderColor } from "@/types/folder.types";

export type TaskScope = "personal" | "team";

export type TaskFolder = {
  id: string;
  name: string;
  color: FolderColor;
};

export type TaskListItem = {
  id: string;
  folderId: string;
  title: string;
  scope: TaskScope;
  // 진행 중이면 dday, 완료면 completedDate 사용
  dday: string;
  completedDate: string;
};

// API 작업 전까지 임시로 사용할 더미 데이터
export const TASK_FOLDERS: readonly TaskFolder[] = [
  { id: "1", name: "폴더 1", color: "sub-01" },
  { id: "2", name: "폴더 2", color: "sub-02" },
  { id: "3", name: "폴더 3", color: "sub-03" },
  { id: "4", name: "폴더 4", color: "sub-04" },
  { id: "5", name: "폴더 5", color: "sub-05" },
  { id: "6", name: "폴더 6", color: "sub-null" },
];

export const ONGOING_TASKS: readonly TaskListItem[] = [
  task("1", "1", "personal", "D-1"),
  task("2", "2", "personal", "D-3"),
  task("3", "3", "personal", "D-5"),
  task("4", "4", "personal", "D-7"),
  task("5", "6", "personal", "D-10"),
  task("6", "1", "team", "D-2"),
];

export const COMPLETED_TASKS: readonly TaskListItem[] = [
  task("7", "1", "personal", "", "2026.10.31"),
  task("8", "2", "personal", "", "2026.10.28"),
  task("9", "3", "personal", "", "2026.10.20"),
  task("10", "4", "personal", "", "2026.10.15"),
  task("11", "5", "personal", "", "2026.10.02"),
  task("12", "1", "team", "", "2026.09.30"),
];

function task(
  id: string,
  folderId: string,
  scope: TaskScope,
  dday: string,
  completedDate = ""
): TaskListItem {
  return { id, folderId, title: "과제명", scope, dday, completedDate };
}
