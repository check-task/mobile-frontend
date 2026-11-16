import type { FolderColor } from "@/types/folder.types";

import type { HomeSort } from "../api/home.types";

export const HOME_SORTS: readonly HomeSort[] = [
  "PRIORITY",
  "DEADLINE",
  "PROGRESSRATE",
];

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
