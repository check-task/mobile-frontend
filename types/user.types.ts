export type MyFolder = {
  folderId: number;
  folderTitle: string;
  /** hex 문자열. lib/folderColor 의 toFolderColor 로 토큰으로 바꾼다 */
  color: string;
};

export type LoginType = "LOCAL" | "KAKAO";

/** GET /api/v1/user/me */
export type MyInfoResponse = {
  userId: number;
  nickname: string;
  // 카카오 가입자는 연락처·이메일·사진이 없을 수 있다
  phoneNum: string | null;
  email: string | null;
  profileImage: string | null;
  loginType: LoginType;
  deadlineAlarm: number;
  taskAlarm: number;
  folders: MyFolder[];
};
