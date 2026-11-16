import type { FolderColor } from "@/types/folder.types";

/** `지정안함` 포함 6개 → 사용자 폴더는 5개까지 */
export const MAX_FOLDER_COUNT = 5;

/** 폴더에 고를 수 있는 색 (sub-null 은 `지정안함` 전용) */
export const FOLDER_COLOR_OPTIONS = [
  "sub-01",
  "sub-02",
  "sub-03",
  "sub-04",
  "sub-05",
] as const satisfies readonly FolderColor[];

/** 알림 시간 선택지: 24시간 전 ~ 1시간 전 */
export const ALARM_HOUR_OPTIONS = Array.from(
  { length: 24 },
  (_, index) => 24 - index
);
