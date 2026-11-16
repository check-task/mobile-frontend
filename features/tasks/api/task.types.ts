import type { NativeFilePart } from "@/types/formData.types";

export type TaskType = "TEAM" | "PERSONAL";

export type CreateTaskRequest = {
  title: string;
  /** ISO 8601 date-time */
  deadline: string;
  type: TaskType;
  /** 생략하면 서버가 미지정 폴더로 둔다 */
  folderId?: number;
  isAlarm?: boolean;
  subTasks?: {
    title: string;
    /** ISO 8601 date-time. 미지정이면 null */
    endDate: string | null;
    isAlarm?: boolean;
  }[];
  references?: { name: string; url?: string; fileUrl?: string }[];
  communications?: { name: string; url: string }[];
};

export type CreateTaskResponse = { taskId: number };

/** GET /api/v1/task 의 과제 항목 */
export type TaskListItemDto = {
  taskId: number;
  folderId: number | null;
  /** hex 문자열 */
  foldercolor: string;
  folderTitle: string;
  title: string;
  type: TaskType;
  /** `2026.06.30` */
  deadline: string;
  /** `D-140` */
  dDay: string;
  progressRate: number;
};

/** GET /api/v1/task. 목록 화면은 task 만 쓴다 */
export type TaskListResponse = {
  task: TaskListItemDto[];
};

/** GET /api/v1/task/completed 의 과제 항목 */
export type CompletedTaskDto = {
  taskId: number;
  title: string;
  /** ISO date-time (마감일) */
  deadline: string;
  type: string;
  folderId: number | null;
  folderTitle: string | null;
  /** hex 문자열 */
  color: string | null;
};

export type CompletedTasksResponse = {
  tasks: CompletedTaskDto[];
};

export type CreateReferenceParams =
  | { type: "url"; name: string; url: string }
  | {
      type: "file";
      name?: string;
      /** native 는 { uri, name, type } 파트, web 은 File */
      file: Blob | NativeFilePart;
    };

export type SubTaskStatus = "PENDING" | "COMPLETED";

/** 시각은 타임존 표기 없는 UTC(`2026-11-20T10:00:00`)로 온다 */
export type SubTaskDto = {
  subTaskId: number;
  title: string;
  deadline: string | null;
  status: SubTaskStatus;
  isAlarm: boolean;
  commentCount: number;
  comments: {
    commentId: number;
    content: string;
    writer: string;
    profileImage: string | null;
    createdAt: string;
  }[];
  assignees: {
    memberId: number;
    userId: number;
    nickname: string;
    profileImage: string | null;
  }[];
};

/** GET /api/v1/task/:taskId */
export type TaskDetailResponse = {
  taskId: number;
  title: string;
  folderId: number | null;
  /** 서버 필드명이 소문자 c 다. hex 문자열 */
  foldercolor: string;
  folderTitle: string;
  type: TaskType;
  deadline: string | null;
  /** `D-3`, `D-Day`, `D+2` */
  dDay: string | null;
  progressRate: number;
  subTasks: SubTaskDto[];
  communications: { id: number; name: string; url: string }[];
  meetingLogs: {
    id: number;
    date: string;
    agenda: string | null;
    conclusion: string | null;
    discussion: string | null;
  }[];
  references: {
    id: number;
    name: string;
    fileName: string | null;
    url: string | null;
    fileUrl: string | null;
  }[];
};

export type TaskMember = {
  /** User.id. 담당자 지정에 이 값을 보낸다 */
  id: number;
  nickname: string;
  profileImage: string | null;
  role: "owner" | "member";
};

/** GET /api/v1/task/:taskId/members */
export type TaskMembersResponse = { members: TaskMember[]; count: number };

/** POST /api/v1/task/:taskId/invitation. 유효한 코드가 있으면 그 코드를 다시 준다 */
export type InviteCodeResponse = {
  invite_code: string;
  invite_expired: string;
};

export type AddSubTaskRequest = {
  title: string;
  /** ISO 8601 date-time. 미지정이면 null */
  deadline: string | null;
};

export type AddSubTaskResponse = {
  subTaskId: number;
  title: string;
  deadline: string | null;
};

/** Reference API 는 snake_case 로 온다 */
export type ReferenceDto = {
  reference_id: number;
  name: string;
  url: string | null;
  file_name?: string | null;
  file_url: string | null;
};

/** PATCH /api/v1/task/:taskId. 전부 선택. 유형(type)은 수정 화면에서 바꾸지 않아 보내지 않는다 */
export type UpdateTaskRequest = {
  title?: string;
  /** null 이면 폴더 해제 */
  folderId?: number | null;
  /** ISO 8601 date-time */
  deadline?: string;
  /** 스펙은 id 없으면 생성이라지만 실제로는 무시된다. 새 세부 과제는 addSubTask 로 만든다 */
  subTasks?: { id?: number; title: string; endDate: string | null }[];
};

/** PATCH /api/v1/reference/data/:taskId/:referenceId (multipart). 파일은 새로 골랐을 때만 보낸다 */
export type UpdateReferenceParams = {
  name: string;
  url?: string;
  file?: Blob | NativeFilePart;
};
