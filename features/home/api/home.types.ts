import type { HomeSort } from "../components/homeData";

export type TaskListParams = { sort: HomeSort };

/** 날짜는 `2026.06.30` 형식으로 온다 */
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
