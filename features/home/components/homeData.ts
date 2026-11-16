// API 작업 전까지 임시로 사용할 더미 데이터
// TODO(api): GET /api/v1/task (task[], subTask[]) · GET /api/v1/user/me (folders[])
import type { FolderColor } from "@/types/folder.types";

export type HomeFolder = {
  id: number;
  name: string;
  color: FolderColor;
};

export type HomeTask = {
  id: number;
  folderId: number;
  title: string;
  type: "PERSONAL" | "TEAM";
  /** `YYYY-MM-DD` */
  deadline: string;
  dDay: string;
  progressRate: number;
  priority: number;
};

export type HomeSubTask = {
  id: number;
  taskId: number;
  title: string;
  /** `YYYY-MM-DD`. `null` 이면 날짜 미지정 */
  deadline: string | null;
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

// TODO(api): POST /api/v1/task/join 응답의 task_id 로 바꾼다
export const DUMMY_JOINED_TASK_ID = 2;

export const HOME_FOLDERS: readonly HomeFolder[] = [
  { id: 1, name: "전공", color: "sub-01" },
  { id: 2, name: "교양", color: "sub-02" },
  { id: 3, name: "동아리", color: "sub-03" },
  { id: 4, name: "대외활동", color: "sub-04" },
  { id: 5, name: "개인", color: "sub-05" },
  { id: 6, name: "미지정", color: "sub-null" },
];

export const HOME_TASKS: readonly HomeTask[] = [
  task(1, 1, "자료구조 과제", "PERSONAL", "2026-11-20", "D-4", 60, 1),
  task(2, 1, "운영체제 팀플", "TEAM", "2026-11-20", "D-4", 30, 2),
  task(3, 2, "교양 리포트", "PERSONAL", "2026-11-25", "D-9", 10, 3),
  task(4, 3, "동아리 발표 준비", "TEAM", "2026-11-28", "D-12", 80, 4),
  task(5, 4, "공모전 기획서", "TEAM", "2026-12-03", "D-17", 0, 5),
  task(6, 5, "토익 공부", "PERSONAL", "2026-11-18", "D-2", 45, 6),
];

export const HOME_SUB_TASKS: readonly HomeSubTask[] = [
  { id: 101, taskId: 1, title: "자료 조사", deadline: "2026-11-17" },
  { id: 102, taskId: 1, title: "코드 작성", deadline: null },
  { id: 103, taskId: 2, title: "역할 분담", deadline: "2026-11-17" },
  { id: 104, taskId: 3, title: "초안 작성", deadline: null },
  { id: 105, taskId: 4, title: "슬라이드", deadline: "2026-11-24" },
  { id: 106, taskId: 5, title: "아이디어 회의", deadline: null },
  { id: 107, taskId: 6, title: "LC 모의고사", deadline: null },
];

function task(
  id: number,
  folderId: number,
  title: string,
  type: HomeTask["type"],
  deadline: string,
  dDay: string,
  progressRate: number,
  priority: number
): HomeTask {
  return { id, folderId, title, type, deadline, dDay, progressRate, priority };
}
