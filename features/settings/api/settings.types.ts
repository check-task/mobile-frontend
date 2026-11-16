import type { FolderColor } from "@/types/folder.types";
import type { LoginType } from "@/types/user.types";
import type { NativeFilePart } from "@/types/formData.types";

/** POST /api/v1/user/folder, PATCH /api/v1/user/folder/{folderId} */
export type FolderRequest = {
  folderTitle: string;
  /** 서버 허용 hex 중 하나 */
  color: string;
};

export type FolderResponse = {
  folderId: number;
  userId: number;
  folderTitle: string;
  color: string;
};

/** PATCH /api/v1/user/folder/priority */
export type UpdateFolderPriorityRequest = {
  orderedFolders: { folderId: number; rank: number }[];
};

/** PATCH /api/v1/user/profile (multipart). 바꾼 필드만 보낸다 */
export type UpdateProfileRequest = {
  nickname?: string;
  phoneNum?: string;
  image?: Blob | NativeFilePart;
};

/* 화면용 타입 (settingsMapper 가 만든다) */

export type SettingsFolder = {
  id: number;
  name: string;
  color: FolderColor;
};

export type SettingsProfile = {
  nickname: string;
  phoneNum: string;
  email: string;
  profileImage: string | null;
};

export type SettingsUser = SettingsProfile & {
  loginType: LoginType;
  /** 최종 마감 알림: 과제 마감 N시간 전 */
  deadlineAlarm: number;
  /** TASK별 알림: 세부 과제 마감 N시간 전 */
  taskAlarm: number;
  /** `지정안함`을 뺀 사용자 폴더 (서버 우선순위 순) */
  folders: SettingsFolder[];
};
