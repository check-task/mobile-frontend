// API 작업 전까지 임시로 사용할 더미 데이터
// TODO(api): GET /api/v1/user/me
import type { FolderColor } from "@/types/folder.types";

export type LoginType = "LOCAL" | "KAKAO";

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

export const DUMMY_USER: SettingsUser = {
  nickname: "닉네임",
  phoneNum: "010-0000-0000",
  email: "checktask@ct.kr",
  profileImage: null,
  loginType: "LOCAL",
  deadlineAlarm: 24,
  taskAlarm: 24,
  folders: [
    { id: 1, name: "폴더명", color: "sub-01" },
    { id: 2, name: "폴더명", color: "sub-02" },
    { id: 3, name: "폴더명", color: "sub-03" },
    { id: 4, name: "폴더명", color: "sub-04" },
    { id: 5, name: "폴더명", color: "sub-05" },
  ],
};
