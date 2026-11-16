import type { FolderColor } from "@/types/folder.types";

// ── 화면용 타입 (mapper 가 서버 응답을 이 형태로 바꾼다) ──

export type HomeSort = "PRIORITY" | "DEADLINE" | "PROGRESSRATE";

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

// ── 서버 DTO ──

export type TaskListParams = { sort: HomeSort };

/**
 * 마감은 타임존 없는 UTC 시각(`2026-11-19T01:00:00`)으로 온다.
 * 날짜만 지정한 마감은 `T23:59:59` 라 시간대 변환 없이 날짜를 그대로 쓴다 (homeMapper `toDateKey`).
 */
export type TaskListResponse = {
  task: {
    taskId: number;
    folderId: number | null;
    /** hex 또는 "값 없음" */
    foldercolor: string;
    folderTitle: string;
    folderRank: number | null;
    priority: number;
    status: string;
    title: string;
    type: "PERSONAL" | "TEAM";
    deadline: string;
    dDay: string;
    progressRate: number;
  }[];
  /** 마감일 오름차순. 완료된 세부 과제는 빠져 있다 */
  subTask: {
    subTaskId: number;
    taskId: number;
    title: string;
    status: string;
    deadline: string | null;
  }[];
};

export type JoinTeamTaskRequest = {
  inviteCode: string;
  /** 생략하면 서버 기본 폴더 */
  folderId?: number;
};

export type JoinTeamTaskResponse = {
  task_id: number;
  task_title: string;
  member_id: number;
  folderId: number;
};
