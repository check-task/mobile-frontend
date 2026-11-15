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

export type MyFolder = {
  folderId: number;
  folderTitle: string;
  /** hex 문자열. taskMapper 에서 FolderColor 토큰으로 바꾼다 */
  color: string;
};

/** GET /api/v1/user/me 중 과제 등록에 쓰는 필드만 */
export type MyInfoResponse = {
  userId: number;
  folders: MyFolder[];
};

export type CreateReferenceParams =
  | { type: "url"; name: string; url: string }
  | {
      type: "file";
      name?: string;
      /** native 는 { uri, name, type } 파트, web 은 File */
      file: Blob | NativeFilePart;
    };

/** Reference API 는 snake_case 로 온다 */
export type ReferenceDto = {
  reference_id: number;
  name: string;
  url: string | null;
  file_name?: string | null;
  file_url: string | null;
};
