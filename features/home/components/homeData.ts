import type { FolderColor } from "@/types/folder.types";

export type HomeFolder = {
  id: number;
  name: string;
  color: FolderColor;
};

export type HomeTask = {
  id: number;
  /** `null` 이면 미지정 폴더 */
  folderId: number | null;
  folderName: string;
  color: FolderColor;
  title: string;
  type: "PERSONAL" | "TEAM";
  /** `YYYY-MM-DD` */
  deadline: string;
  dDay: string;
  progressRate: number;
};

export type HomeSubTask = {
  id: number;
  taskId: number;
  title: string;
  /** `YYYY-MM-DD`. `null` 이면 날짜 미지정 */
  deadline: string | null;
};

export type HomeTasks = {
  tasks: HomeTask[];
  subTasks: HomeSubTask[];
};

export const HOME_SORTS = ["PRIORITY", "DEADLINE", "PROGRESSRATE"] as const;
export type HomeSort = (typeof HOME_SORTS)[number];

export const HOME_SORT_LABEL: Record<HomeSort, string> = {
  PRIORITY: "우선순위",
  DEADLINE: "마감일순",
  PROGRESSRATE: "진척도순",
};

/** 캘린더 칸·날짜 미지정 영역에 그리는 항목 */
export type CalendarItem = {
  key: string;
  /** `kind` 에 따라 과제 id 또는 세부 task id */
  id: number;
  kind: "main" | "sub";
  title: string;
  color: FolderColor;
};
