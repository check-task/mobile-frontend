export type MyFolder = {
  folderId: number;
  folderTitle: string;
  /** hex 문자열. lib/folderColor 의 toFolderColor 로 토큰으로 바꾼다 */
  color: string;
};

/** GET /api/v1/user/me 중 앱에서 쓰는 필드만 */
export type MyInfoResponse = {
  userId: number;
  folders: MyFolder[];
};
